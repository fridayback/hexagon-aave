const {saveDeploy,getContractAddr} = require('../utils');

module.exports = async (hre) => {
    const {getNamedAccounts, deployments,getChainId} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

//  TODO
    const contract = await deploy('LendingPoolCollateralManager', {
      from: deployer,
      log: true,
    });
    saveDeploy(chainId,'LendingPoolCollateralManager',contract.address,contract.receipt);
  };
  module.exports.tags = ['LendingPoolCollateralManager'];
