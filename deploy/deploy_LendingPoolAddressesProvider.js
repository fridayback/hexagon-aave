const { saveDeploy, getContractAddr } = require('../utils');

const contractName = 'LendingPoolAddressesProvider';
module.exports = async (hre) => {
  const { getNamedAccounts, deployments, getChainId } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const contract = await deploy(contractName, {
    from: deployer,
    args: ['aave'],
    log: true,
  });
  saveDeploy(chainId, contractName, contract.address, contract.receipt);

  let lendingPoolAddressesProviderRegistry = await hre.ethers.getContractFactory('LendingPoolAddressesProviderRegistry');
  lendingPoolAddressesProviderRegistry = await lendingPoolAddressesProviderRegistry.attach(getContractAddr(chainId, 'LendingPoolAddressesProviderRegistry'));
  await (await lendingPoolAddressesProviderRegistry.registerAddressesProvider(contract.address, 1)).wait(1);
  console.log(`registerAddressesProvider ${contractName} at:`, contract.address);

  let lendingPoolAddressesProvider = await hre.ethers.getContractFactory('LendingPoolAddressesProvider');
  lendingPoolAddressesProvider = await lendingPoolAddressesProvider.attach(contract.address)
  console.log('===== lendingPoolAddressesProvider setPoolAdmin tobe',deployer);
  await (await lendingPoolAddressesProvider.setPoolAdmin(deployer)).wait(1);
  console.log('===== lendingPoolAddressesProvider admin is',await lendingPoolAddressesProvider.getPoolAdmin());

  console.log('===== lendingPoolAddressesProvider setEmergencyAdmin tobe',deployer);
  await (await lendingPoolAddressesProvider.setEmergencyAdmin(deployer)).wait(1);
  console.log('===== lendingPoolAddressesProvider EmergencyAdmin is',await lendingPoolAddressesProvider.getEmergencyAdmin());
  
};
module.exports.tags = [contractName];
