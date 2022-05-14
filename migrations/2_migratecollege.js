var Migrations = artifacts.require("./college,sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};