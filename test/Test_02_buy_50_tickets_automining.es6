"use strict";

/* Run this test in `truffle console`
*  1. run ganache with automining:
*     ganache-cli -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" -u 0 -u 1 --gasLimit 0x2FEFD800000 -a 100 --defaultBalanceEther 10000  > ganache.log
*
*  2. Run truffle console in another terminal:
*     truffle console
*
*  3. Run this test:
*     test test/Test_02_buy_50_tickets_automining.es6
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

contract("Buy 5 tickets: ", accounts => {

    let house = accounts[9]; // see 2_lottery_migration.js
    let price = web3.toWei(10, "finney"); // see 2_lottery_migration.js

    before(async () => {
        let contract = await Lottery.deployed();
        let events = contract.allEvents();
        events.watch(utils.eventLogger(web3));
    });

    it("lottery configuration", async () => {
        const lottery = await Lottery.deployed();
        expect(await lottery.house()).to.equal(house);
        expect(await lottery.price()).to.be.bignumber.equal(price);
    });

    it("buy 5 tickets", async () => {
        let n = 5000;
        const lottery = await Lottery.deployed();

        for (let i = 1; i < 1 + n; i++) {
            let account = accounts[i % 100];
            console.log(i);
            lottery.takePart.sendTransaction({from: account, value: price});
            // await utils.assertEvent(lottery, {
            //     event: "BuyTicket",
            //     args: {participant: account}
            // });
        }

        expect(await lottery.jackpot()).to.be.bignumber.equal(n * price);
    });

    it("payouts", async () => {
        const lottery = await Lottery.deployed();

        let fund = await lottery.jackpot();

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