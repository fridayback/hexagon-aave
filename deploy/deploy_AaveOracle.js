const { saveDeploy, getConfig,getContractAddr,getOracleParamPairs,getQuoteCurrency } = require('../utils');

module.exports = async (hre) => {
  const { getNamedAccounts, deployments, getChainId } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // const {assets,chainLinkAggregators} = getOracleParamPairs(chainId);
  const config = getConfig(chainId);
  console.log('****&&&&&',chainId,config);
  const {FallbackOracle,OracleQuoteUnit,OracleQuoteCurrency} = config;

  // console.log('****&&&&&', [
  //   assets,
  //   chainLinkAggregators,
  //   FallbackOracle,
  //   getQuoteCurrency(config),
  //   OracleQuoteUnit,
  // ])

  const contract = await deploy('AaveOracle', {
    from: deployer,
    log: true,
    args: [
      [],
      [],
      FallbackOracle,
      getQuoteCurrency(config),
      OracleQuoteUnit,
    ]
  });
  saveDeploy(chainId, 'AaveOracle', contract.address, contract.receipt);
};
module.exports.tags = ['AaveOracle'];
