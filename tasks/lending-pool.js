const { saveDeploy, getConfig, getContractAddr, getOracleParamPairs } = require('../utils');

task('lending-pool', 'Deploy lending pool')
  .setAction(async (args) => {
    // const contractName = 'LendingPool';
    const chainId = await hre.getChainId();

    await run('deploy', { tags: 'LendingPoolAddressesProviderRegistry' });
    await run('deploy', { tags: 'LendingPoolAddressesProvider' });
    await run('deploy', { tags: 'LendingPool' });
    await run('deploy', { tags: 'LendingPoolConfigurator' });
    await run('deploy', { tags: 'StableAndVariableTokensHelper' });
    await run('deploy', { tags: 'ATokensAndRatesHelper' });
    await run('deploy', { tags: 'AToken' });
    await run('deploy', { tags: 'DelegationAwareAToken' });
    await run('deploy', { tags: 'VariableDebtToken' });
    await run('deploy', { tags: 'StableDebtToken' });
    await run('deploy', { tags: 'AaveOracle' });
    await run('deploy', { tags: 'LendingRateOracle' });
    await run('deploy', { tags: 'AaveProtocolDataProvider' });
    await run('deploy', { tags: 'WETHGateway' });
    await run('deploy', { tags: 'LendingPoolCollateralManager' });
    await run('deploy', { tags: 'WalletBalanceProvider' });
    await run('deploy', { tags: 'UiPoolDataProviderV2' });

    let lendingPoolProxy = await hre.ethers.getContractFactory('LendingPool',
      {
        // signer: hre.namedAccounts(),
        libraries: {
          'ReserveLogic': getContractAddr(chainId, 'ReserveLogic'),
          // 'GenericLogic': getContractAddr(chainId, 'GenericLogic'),
          'ValidationLogic': getContractAddr(chainId, 'ValidationLogic')
        }
      });
    lendingPoolProxy = await lendingPoolProxy.attach(getContractAddr(chainId, 'LendingPool'));

    let lendingPoolAddressesProviderAddr = getContractAddr(chainId, 'LendingPoolAddressesProvider');
    let lendingPoolAddressesProvider = await hre.ethers.getContractFactory('LendingPoolAddressesProvider');
    lendingPoolAddressesProvider = await lendingPoolAddressesProvider.attach(lendingPoolAddressesProviderAddr);

    let lendingPoolConfiguratorAddr = await lendingPoolAddressesProvider.getLendingPoolConfigurator();
    let lendingPoolConfiguratorProxy = await hre.ethers.getContractFactory('LendingPoolConfigurator');
    lendingPoolConfiguratorProxy = await lendingPoolConfiguratorProxy.attach(lendingPoolConfiguratorAddr);

    console.log('LendingPoolConfigurator setPoolPause true', lendingPoolConfiguratorAddr);
    await (await lendingPoolConfiguratorProxy.setPoolPause(true)).wait(1);

    const stableAndVariableTokensHelperAddr = getContractAddr(chainId, 'StableAndVariableTokensHelper');
    let stableAndVariableTokensHelper = await hre.ethers.getContractFactory('StableAndVariableTokensHelper');
    stableAndVariableTokensHelper = await stableAndVariableTokensHelper.attach(stableAndVariableTokensHelperAddr);

    let aaveOracleAddr = getContractAddr(chainId, 'AaveOracle');

    let lendingRateOracleAddr = getContractAddr(chainId, 'LendingRateOracle');
    await (await lendingPoolAddressesProvider.setLendingRateOracle(lendingRateOracleAddr)).wait(1);
    console.log('==== setLendingRateOracle', lendingRateOracleAddr);
    await (await lendingPoolAddressesProvider.setPriceOracle(aaveOracleAddr)).wait(1);
    console.log('==== setPriceOracle', aaveOracleAddr);

    await (await lendingPoolAddressesProvider.setAddress('0x1000000000000000000000000000000000000000000000000000000000000000', getContractAddr(chainId, 'AaveProtocolDataProvider'))).wait(1);
    console.log('==== setAddress for AaveProtocolDataProvider', aaveOracleAddr);

    const LendingPoolCollateralManagerAddr = getContractAddr(chainId, 'LendingPoolCollateralManager');
    await (await lendingPoolAddressesProvider.setLendingPoolCollateralManager(LendingPoolCollateralManagerAddr)).wait(1);
    console.log('==== setLendingPoolCollateralManager', LendingPoolCollateralManagerAddr);

  });