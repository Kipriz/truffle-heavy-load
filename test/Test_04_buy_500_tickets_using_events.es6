"use strict";

/* Run this test in `truffle console`
*  1. run ganache with automining:
*     ganache-cli -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" -u 0 -u 1 --gasLimit 0x2FEFD800000 -a 100 --defaultBalanceEther 10000 --blocktime 5 > ganache.log
*
*  2. Run truffle console in another terminal:
*     truffle console
*
*  3. Run this test:
*     test test/Test_04_buy_500_tickets_using_events.es6
*
*  The test will take about 59 seconds (468931ms for buying tickets)
* */

const chai = require('chai');

const expect = chai.expect;
const assert = chai.assert;
chai.should();
const BigNumber = require('bignumber.js');
const utils = require("./utils/utils.es6");

//use default BigNumber
chai.use(require('chai-bignumber')(BigNumber));

const Lottery = artifacts.require("../Lottery.sol");

const numberOfTickets = 5000;
const ticketsPerBlock = 90;

contract(`Buy ${numberOfTickets} tickets with events and block of 5 seconds: `, accounts => {

    let house = accounts[9]; // see 2_lottery_migration.js
    let price = web3.toWei(10, "finney"); // see 2_lottery_migration.js

    let lottery;
    let filterLatest;

    before(async () => {
        lottery = await Lottery.deployed();
        let events = lottery.allEvents();
        events.watch(utils.eventLogger(web3));
        filterLatest = web3.eth.filter('latest');
    });

    after(async () => {
        filterLatest.stopWatching();
    });

    it("lottery configuration", async () => {
        expect(await lottery.house()).to.equal(house);
        expect(await lottery.price()).to.be.bignumber.equal(price);
    });

    /* this is not an async test! use done() and promises */
    it(`buy ${numberOfTickets} tickets`, (done) => {

        let buyTickets = (ticketsAtOnce, iteration) => {
            return () => {
                for (let i = 10; i < 10 + ticketsAtOnce; i++) {
                    let account = accounts[i];
                    lottery.takePart.sendTransaction({from: account, value: price});
                }
                console.log(`finish buying ${ticketsAtOnce} tickets, iteration ${iteration};`);
            }
        };

        // buy tickets in loop
        let cycles = Math.floor(numberOfTickets / ticketsPerBlock);
        let rest = numberOfTickets % ticketsPerBlock;
        let j = 0;
        filterLatest.watch(function (error, log) {
            console.log("Filter latest: mined " + log);
            console.log(`j: ${j}, cycles: ${cycles}`);
            if (j < cycles) {
                buyTickets(ticketsPerBlock, j)();
                j++;
            } else if (j == cycles) {
                buyTickets(rest, cycles)();
                j++;
            } else {
                console.log(`Done buying ${numberOfTickets} tickets`);
                filterLatest.stopWatching();
                setTimeout(() => {
                    done();
                }, 5000);
            }
        });

        console.log("setTimeout has done");


    }).timeout(5000000);

    it("payouts", async () => {
        const lottery = await Lottery.deployed();

        let fund = await lottery.jackpot();
        expect(fund).to.be.bignumber.equal(numberOfTickets * price);

        await lottery.makePayouts.sendTransaction({from: house});
        await utils.assertEvent(lottery, {
            event: "Transfer",
            args: {msg: "Main winner"}
        });
        await utils.assertEvent(lottery, {
            event: "Transfer",
            args: {target: house}
        });

        expect(await lottery.jackpot()).to.be.bignumber
            .equal(fund.mul(0.1), "Payouts should leave 10% in jackpot fund");

    });
});