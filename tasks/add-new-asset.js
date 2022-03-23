const { saveDeploy, getConfig, getContractAddr, getOracleParamPairs } = require('../utils');

task('add-new-asset', 'Add a new asset')
    .addParam("atoken", "the aToken name will be deployed")
    .setAction(async ({ atoken }) => {

        const chainId = await hre.getChainId();
        const config = getConfig(chainId);
        const provider = getContractAddr(chainId, 'LendingPoolAddressesProvider');

        let lendingPoolAddressesProvider = await hre.ethers.getContractFactory('LendingPoolAddressesProvider');
        lendingPoolAddressesProvider = await lendingPoolAddressesProvider.attach(provider);
        let admin = await lendingPoolAddressesProvider.getPoolAdmin();

        let aTokensAndRatesHelperAddr = getContractAddr(chainId, 'ATokensAndRatesHelper');
        console.log('old poolAdmin:', admin, 'new poolAdmin:', aTokensAndRatesHelperAddr);
        await (await lendingPoolAddressesProvider.setPoolAdmin(aTokensAndRatesHelperAddr)).wait(1);
        console.log('set poolAdmin finish');


        let atokens = atoken.split(',');
        let initInputParams = [];
        let cfgs = [];
        let oracleParams = { assets: [], aggregators: [] };

        for (let index = 0; index < atokens.length; index++) {
            const atoken = atokens[index];
            console.log('deploy', atoken);
            const strategy = config.ReservesConfig[atoken];
            console.log('reserve strategy:\n', strategy);
            const rateStrategy = strategy.strategy;
            let rateStrategyAddr = getContractAddr(chainId, `DefaultReserveInterestRateStrategy_${rateStrategy.name}`);
            console.log('rateStrategyAddr = ', rateStrategyAddr);

            if (!rateStrategyAddr) {
                //deploy DefaultReserveInterestRateStrategy
                let DefaultReserveInterestRateStrategy = await hre.ethers.getContractFactory('DefaultReserveInterestRateStrategy');

                const defaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(
                    provider,
                    rateStrategy.optimalUtilizationRate,
                    rateStrategy.baseVariableBorrowRate,
                    rateStrategy.variableRateSlope1,
                    rateStrategy.variableRateSlope2,
                    rateStrategy.stableRateSlope1,
                    rateStrategy.stableRateSlope2
                );
                await defaultReserveInterestRateStrategy.deployed();
                console.log('deploy DefaultReserveInterestRateStrategy with rate strategy:\n', rateStrategy.name);
                saveDeploy(chainId, `DefaultReserveInterestRateStrategy_${rateStrategy.name}`, defaultReserveInterestRateStrategy.address);
                rateStrategyAddr = defaultReserveInterestRateStrategy.address;
            }

            //----------------
            let initParam = {
                aTokenImpl: getContractAddr(chainId, strategy.aTokenImpl),
                stableDebtTokenImpl: getContractAddr(chainId, 'StableDebtToken'),
                variableDebtTokenImpl: getContractAddr(chainId, 'VariableDebtToken'),
                underlyingAssetDecimals: strategy.reserveDecimals,
                interestRateStrategyAddress: rateStrategyAddr,
                underlyingAsset: strategy.underlying,
                treasury: config.ReserveFactorTreasuryAddress,
                incentivesController: config.IncentivesController,
                underlyingAssetName: atoken,
                aTokenName: `${config.ATokenNamePrefix} ${atoken}`,
                aTokenSymbol: `a${config.SymbolPrefix}${atoken}`,
                variableDebtTokenName: `${config.VariableDebtTokenNamePrefix} ${config.SymbolPrefix}${atoken}`,
                variableDebtTokenSymbol: `variableDebt${config.SymbolPrefix}${atoken}`,
                stableDebtTokenName: `${config.StableDebtTokenNamePrefix} ${atoken}`,
                stableDebtTokenSymbol: `stableDebt${config.SymbolPrefix}${atoken}`,
                params: '0x10'
            }
            initInputParams.push(initParam);


            //add asset in price oracle
            //setAssetSources
            oracleParams.assets.push(strategy.underlying);
            oracleParams.aggregators.push(strategy.ChainlinkAggregator);

            //   let MockOracleAddr = getContractAddr(chainId,'MockOracle');
            //   let mockOracle = await hre.ethers.getContractFactory('MockOracle');
            //   mockOracle = await mockOracle.attach(MockOracleAddr);

            //   await (await mockOracle.setPrice([strategy.underlying], [100000000]));
            console.log(`configure Reserves ${atoken}`);
            cfgs.push({
                asset: strategy.underlying,
                baseLTV: strategy.baseLTVAsCollateral,
                liquidationThreshold: strategy.liquidationThreshold,
                liquidationBonus: strategy.liquidationBonus,
                reserveFactor: strategy.reserveFactor,
                stableBorrowingEnabled: strategy.stableBorrowRateEnabled,
                borrowingEnabled: strategy.borrowingEnabled,
            });


        }

        let aaveOracleAddr = getContractAddr(chainId, 'AaveOracle');
        let aaveOracle = await hre.ethers.getContractFactory('AaveOracle');
        aaveOracle = await aaveOracle.attach(aaveOracleAddr);
        console.log(`add ${atoken} in price oracle: ${oracleParams.aggregators}`);
        await (await aaveOracle.setAssetSources(oracleParams.assets, oracleParams.aggregators));

        let aTokensAndRatesHelper = await hre.ethers.getContractFactory('ATokensAndRatesHelper');
        aTokensAndRatesHelper = await aTokensAndRatesHelper.attach(aTokensAndRatesHelperAddr);
        await (await aTokensAndRatesHelper.configureReserves(cfgs)).wait(1);

        console.log('recover poolAdmin');
        await (await lendingPoolAddressesProvider.setPoolAdmin(admin)).wait(1);
        console.log('set poolAdmin finish 2');
        //
        let lendingPoolConfiguratorProxy = await hre.ethers.getContractFactory('LendingPoolConfigurator');
        // console.log('2',getContractAddr(chainId,'LendingPoolConfigurator'));
        lendingPoolConfiguratorProxy = await lendingPoolConfiguratorProxy.attach(getContractAddr(chainId, 'LendingPoolConfigurator'));

        let reciept = await (await lendingPoolConfiguratorProxy.batchInitReserve(initInputParams, { gasLimit: 5000000 })).wait(1);
        console.log('reciept:', reciept.status);

    });