const { saveDeploy, getContractAddr } = require('../utils');

module.exports = async (hre) => {
  const { getNamedAccounts, deployments, getChainId } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const reserveLogic = await deploy('ReserveLogic', { from: deployer, log: true });
  // console.log('ReserveLogic:',reserveLogic);
  saveDeploy(chainId, 'ReserveLogic', reserveLogic.address, reserveLogic.receipt);

  const genericLogic = await deploy('GenericLogic', {
    from: deployer, log: true,
    libraries: { 'ReserveLogic': reserveLogic.address }
  });
  // console.log('GenericLogic:',genericLogic);
  saveDeploy(chainId, 'GenericLogic', genericLogic.address, genericLogic.receipt);

  const validationLogic = await deploy('ValidationLogic', {
    from: deployer, log: true,
    libraries: {
      'ReserveLogic': reserveLogic.address,
      'GenericLogic': genericLogic.address
    }
  });
  // console.log('ValidationLogic:',validationLogic);
  saveDeploy(chainId, 'ValidationLogic', validationLogic.address, validationLogic.receipt);

  const contract = await deploy('LendingPool', {
    from: deployer, log: true,
    libraries: {
      'ReserveLogic': reserveLogic.address,
      'GenericLogic': genericLogic.address,
      'ValidationLogic': validationLogic.address
    }
  });

  saveDeploy(chainId, 'LendingPool-impl', contract.address, contract.receipt);

  let lendingPoolAddressesProviderAddr = getContractAddr(chainId, 'LendingPoolAddressesProvider');
  let lendingPoolAddressesProvider = await hre.ethers.getContractFactory('LendingPoolAddressesProvider');
  lendingPoolAddressesProvider = await lendingPoolAddressesProvider.attach(lendingPoolAddressesProviderAddr);
  try {
    await (await lendingPoolAddressesProvider.setLendingPoolImpl(contract.address)).wait(1);
    console.log('===== setLendingPoolImpl', contract.address);
  } catch (error) {
    console.log('===== setLendingPoolImpl failed', error);
  }


  const lendPoolProxy = await lendingPoolAddressesProvider.getLendingPool();
  saveDeploy(chainId, 'LendingPool', lendPoolProxy);

  // let LendingPoolProxy = await hre.ethers.getContractFactory('LendingPool');
  // LendingPoolProxy = await LendingPoolProxy.attach(getContractAddr(chainId, 'LendingPool'));

};

module.exports.tags = ['LendingPool'];
