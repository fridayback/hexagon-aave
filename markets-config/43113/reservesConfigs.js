const { eContractid } = require('../types');

const rateStrategy  = require('./rateStrategies');
let {
  oneRay,
  ZERO_ADDRESS,
  MOCK_CHAINLINK_AGGREGATORS_PRICES,
  oneEther,
} = require('../constants');

module.exports.strategyUSDC = {
  underlying:'0xe22da380ee6B445bb8273C81944ADEB6E8450422',
  strategy: rateStrategy.rateStrategyStableThree,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8500',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  reserveDecimals: '6',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  borrowRate: oneRay.multipliedBy(0.03).toFixed(),
  ChainlinkAggregator:'0x64EaC61A2DFda2c3Fa04eED49AA33D021AeC8838',
};

module.exports.strategyUSDT = {
  underlying:'0x82e9479DbfE8e39f816818c9fe52B898AfE4B44B',
  strategy: rateStrategy.rateStrategyStableThree,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8500',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  reserveDecimals: '6',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  borrowRate: oneRay.multipliedBy(0.03).toFixed(),
  ChainlinkAggregator: '0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad',
};


module.exports.strategyWETH = {
  underlying:'0xeC3aa1D621a7a6b64B75c5D646B7b77005A79F2A',
  strategy: rateStrategy.rateStrategyWETH,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8250',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  borrowRate: oneRay.multipliedBy(0.03).toFixed(),
  ChainlinkAggregator: '0x86d67c3D38D2bCeE722E601025C25a575021c6EA',//TODO liulin
};

module.exports.strategyWAVAX = {
  underlying:'0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
  strategy: rateStrategy.rateStrategyWAVAX,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8250',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  borrowRate: oneRay.multipliedBy(0.03).toFixed(),
  ChainlinkAggregator: '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD',
};


module.exports.strategyUST = {
  underlying:'0x9F58f83Aa52f423afb1fCC074fE6A4159Ea794D0',
  strategy: rateStrategy.rateStrategyStableThree,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8500',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  reserveDecimals: '6',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  borrowRate: oneRay.multipliedBy(0.03).toFixed(),
  ChainlinkAggregator: '0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad',
};

module.exports.strategyDAI = {
  underlying:'0x8A5F84ea8793134280C0d56f6380F8A91330084B',
  strategy: rateStrategy.rateStrategyStableThree,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8500',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  reserveDecimals: '18',
  aTokenImpl: eContractid.AToken,
  reserveFactor: '1000',
  borrowRate: oneRay.multipliedBy(0.03).toFixed(),
  ChainlinkAggregator: '0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad',
};