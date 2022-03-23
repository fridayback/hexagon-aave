const {saveDeploy} = require('../utils');

module.exports = async (hre) => {
    const {getNamedAccounts, deployments,getChainId} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();
    const contract = await deploy('LendingPoolAddressesProviderRegistry', {
      from: deployer,
      log: true,
    });
    saveDeploy(chainId,'LendingPoolAddressesProviderRegistry',contract.address,contract.receipt);
  };
  module.exports.tags = ['LendingPoolAddressesProviderRegistry'];
