var Migrations      = artifacts.require("Migrations.sol");
var Minter          = artifacts.require("Minter.sol");
var MinterTestToken = artifacts.require("MintTestToken.sol");
var TestToken       = artifacts.require("TestToken.sol");
const MintTestTokenMock = artifacts.require("MintTestTokenMock.sol");

module.exports = function(deployer) {
    deployer.deploy(Migrations)
    .then(() => deployer.deploy(Minter))
    .then(() => deployer.deploy(TestToken))
    .then(() => deployer.deploy(MinterTestToken, 21600, 10, 60*60))
    .then(() => deployer.deploy(MintTestTokenMock, 21600, 10, 60*60, 100000))    
};




