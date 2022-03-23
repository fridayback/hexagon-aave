const { saveDeploy, getContractAddr } = require('../utils');

const contractName = 'LendingPoolConfigurator';
module.exports = async (hre) => {
  const { getNamedAccounts, deployments, getChainId } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const contract = await deploy(contractName, {
    from: deployer,
    // args:['aave'],
    log: true,
  });
  saveDeploy(chainId, `${contractName}-impl`, contract.address, contract.receipt);

  let lendingPoolAddressesProviderAddr = getContractAddr(chainId, 'LendingPoolAddressesProvider');
  let lendingPoolAddressesProvider = await hre.ethers.getContractFactory('LendingPoolAddressesProvider');
  lendingPoolAddressesProvider = await lendingPoolAddressesProvider.attach(lendingPoolAddressesProviderAddr);


  try {
    await (await lendingPoolAddressesProvider.setLendingPoolConfiguratorImpl(contract.address)).wait(1);
    console.log('===== setLendingPoolConfiguratorImpl', contract.address);
  } catch (error) {
    console.log('===== setLendingPoolConfiguratorImpl failed', error);
  }

  const lendPoolConfiguratorProxy = await lendingPoolAddressesProvider.getLendingPoolConfigurator();
  saveDeploy(chainId, contractName, lendPoolConfiguratorProxy);

};
module.exports.tags = [contractName];
