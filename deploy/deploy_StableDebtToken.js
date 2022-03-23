const {saveDeploy,getContractAddr} = require('../utils');

module.exports = async (hre) => {
    const {getNamedAccounts, deployments,getChainId} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();


    const contract = await deploy('StableDebtToken', {
      from: deployer,
      log: true
    });
    saveDeploy(chainId,'StableDebtToken',contract.address,contract.receipt);

    //initialize
  };
  module.exports.tags = ['StableDebtToken'];
