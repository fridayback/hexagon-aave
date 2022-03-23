let {
  oneRay,
  ZERO_ADDRESS,
  MOCK_CHAINLINK_AGGREGATORS_PRICES,
  oneEther,
} = require('../constants');

let { eEthereumNetwork } = require('../types');

// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

module.exports.CommonsConfig = {
  MarketId: 'Aave genesis market',
  ATokenNamePrefix: 'Aave interest bearing',
  StableDebtTokenNamePrefix: 'Aave stable debt bearing',
  VariableDebtTokenNamePrefix: 'Aave variable debt bearing',
  SymbolPrefix: '',
  ProviderId: 0, // Overriden in index.ts
  OracleQuoteCurrency: 'USD',
  OracleQuoteUnit: oneEther.toString(),
  ProtocolGlobalParams: {
    TokenDistributorPercentageBase: '10000',
    MockUsdPriceInWei: '5848466240000000',
    UsdAddress: '0x10F7Fc1F91Ba351f9C629c5947AD69bD03C05b96',
    NilAddress: '0x0000000000000000000000000000000000000000',
    OneAddress: '0x0000000000000000000000000000000000000001',
    AaveReferral: '0',
  },
  PoolAdmin: undefined,
  PoolAdminIndex: 0,
  EmergencyAdmin: undefined,
  EmergencyAdminIndex: 1,
  ProviderRegistryOwner: '0xB9062896ec3A615a4e4444DF183F0531a77218AE',
  ReserveFactorTreasuryAddress: '0xfb2542861EeDDC8B6dE92b78dbE17D122c05E6D5',
  FallbackOracle: '0x7220660cD7bF862B2f098f61e9c5911A847B7f21',
  IncentivesController: '0x0000000000000000000000000000000000000000'
};
