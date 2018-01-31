Demo project for testing thousands of transactions for smart contracts.

The project contains a very dummy lottery (see `contracts/Lottery.sol`) and a bunch of tests.

How to run tests:
* run `ganache-cli` as following: 

``` ganache-cli -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" -u 0 -u 1 --gasLimit 0x2FEFD800000 -a 100 --defaultBalanceEther 10000 --blocktime 5 > ganache.log ```
* run `truffle` in console mode: `truffle console`
* run tests at once