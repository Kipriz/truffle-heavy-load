var Lottery = artifacts.require("./Lottery.sol");

module.exports = function (deployer) {
    var house = "0x5aeda56215b167893e80b4fe645ba6d5bab767de"; //accounts[9]
    var price = 10000000000000000; // 10 finney
    deployer.deploy(Lottery, house, price);
};
