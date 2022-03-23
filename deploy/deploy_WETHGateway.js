const {saveDeploy,getContractAddr,getConfig} = require('../utils');

module.exports = async (hre) => {
    const {getNamedAccounts, deployments,getChainId} = hre;
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = await getChainId();

    const config = getConfig(chainId);
    console.log(config);
    const WrapNativeToken = config.ReservesConfig[config.NativeToken].underlying;

    const contract = await deploy('WETHGateway', {
      from: deployer,
      log: true,
      args:[WrapNativeToken]
    });
    saveDeploy(chainId,'WETHGateway',contract.address,contract.receipt);

    let lendingPoolAddressesProviderAddr = getContractAddr(chainId, 'LendingPoolAddressesProvider');
    let lendingPoolAddressesProvider = await hre.ethers.getContractFactory('LendingPoolAddressesProvider');
    lendingPoolAddressesProvider = await lendingPoolAddressesProvider.attach(lendingPoolAddressesProviderAddr);

    let lendingPoolAddr = await lendingPoolAddressesProvider.getLendingPool();
    
    //authorizeLendingPool
    let wETHGateway = await hre.ethers.getContractFactory('WETHGateway');
    wETHGateway = await wETHGateway.attach(contract.address);
    await (await wETHGateway.authorizeLendingPool(lendingPoolAddr)).wait(1);
    
  };
  module.exports.tags = ['WETHGateway'];
