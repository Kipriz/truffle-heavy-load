Demo project for testing thousands of transactions for smart contracts.

It needs:
* Truffle 4.0.3
* Ganache-cli v6.1.0-beta.0 (see [this release notes](https://github.com/trufflesuite/ganache-cli/releases/tag/v6.1.0-beta.0))

The project contains a very dummy lottery (see `contracts/Lottery.sol`) and a bunch of tests.

How to run tests:
* [Test_01_buy_5_tickets.es6](test/Test_01_buy_5_tickets.es6) is the basic test. It can be run in `truffle develop`

* [Test_02_buy_500_tickets_automining.es6](test/Test_02_buy_500_tickets_automining.es6) tries to by 500 tickets and needs ganache with automining and `truffle console`
* [Test_03_buy_500_tickets_using_events.es6](test/Test_03_buy_500_tickets_using_events.es6) tries to by 500 tickets and needs ganache with fixed block time and `truffle console`
Number of tickets may be increased to 5K or 15K.


Running ganache with automining:

```
ganache-cli -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" -u 0 -u 1 --gasLimit 0x2FEFD800000 -a 100 --defaultBalanceEther 10000  > ganache.log
```

Running ganache with fixed block time:
``` 
ganache-cli -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" -u 0 -u 1 --gasLimit 0x2FEFD800000 -a 100 --defaultBalanceEther 10000 --blocktime 5 > ganache.log 
```

_PS_ Do not forget to run `npm install` to checkout all necessary deps before running tests.