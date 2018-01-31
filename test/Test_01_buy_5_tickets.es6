"use strict";

/* Run this test in `truffle develop`
*  > truffle develop
*  truffle(develop)> test test/Test_01_buy_5_tickets.es6
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
        let n = 5;
        const lottery = await Lottery.deployed();

        for (let i = 1; i < 1 + n; i++) {
            let account = accounts[i];
            lottery.takePart.sendTransaction({from: account, value: price});
            await utils.assertEvent(lottery, {
                event: "BuyTicket",
                args: {participant: account}
            });
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