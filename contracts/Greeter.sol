//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "hardhat/console.sol";
import "./misc/AaveProtocolDataProvider.sol";
import {IERC20} from './dependencies/openzeppelin/contracts/IERC20.sol';
contract Greeter {
    AaveProtocolDataProvider public dataProvider;

    constructor() public{
        dataProvider = AaveProtocolDataProvider(0x6EE7CEbAEA8D3DD6da06847FB58E0Aa47f077CEa);
    }

    struct ReserveInfo{
        uint256 availableLiquidity;
        uint256 totalStableDebt;
        uint256 totalVariableDebt;
        uint256 liquidityRate;
        uint256 variableBorrowRate;
        uint256 stableBorrowRate;
        uint256 averageStableBorrowRate;
        uint256 liquidityIndex;
        uint256 variableBorrowIndex;
        uint40 lastUpdateTimestamp;
    }

    struct userInfo{
        uint256 currentATokenBalance;
        uint256 currentStableDebt;
        uint256 currentVariableDebt;
        uint256 principalStableDebt;
        uint256 scaledVariableDebt;
        uint256 stableBorrowRate;
        uint256 liquidityRate;
        uint40 stableRateLastUpdated;
        bool usageAsCollateralEnabled;
    }

    function test() public view returns (
        uint256 currentATokenBalance1,
        uint256 currentStableDebt1,
        uint256 currentVariableDebt1,
        uint256 currentATokenBalance2,
        uint256 currentStableDebt2,
        uint256 currentVariableDebt2,
        uint256 delta) {

        // IERC20 aUSDT = IERC20(0xdfFE4F6ac3961AB7d30aeC3cF28d34a998827134);
        // IERC20 stableDebtTokenUSDT = IERC20(0xfefEff44AFA204FCdB3870eCBa5B1BacA16B2720);
        // IERC20 variableDebtTokenUSDT = IERC20(0x03f8e621AC88Df2E5510ab5266a6F7b82a978254);

        (currentATokenBalance1,currentStableDebt1,currentVariableDebt1,,,,,,) 
            = dataProvider.getUserReserveData(address(0x82e9479DbfE8e39f816818c9fe52B898AfE4B44B),address(0xfb2542861EeDDC8B6dE92b78dbE17D122c05E6D5));
        (currentATokenBalance2,currentStableDebt2,currentVariableDebt2,,,,,,) 
            = dataProvider.getUserReserveData(address(0x82e9479DbfE8e39f816818c9fe52B898AfE4B44B),address(0x52F1045671F56f572f7743232B558dDCa0627e10));
        delta = currentATokenBalance1 - (currentStableDebt2 + currentVariableDebt2);
        // (a1,,,,,,,,) = dataProvider.getUserReserveData(asset1,supplier);
        // (,a2,,,,,,,) = dataProvider.getUserReserveData(asset1,borrower);
    }

}
