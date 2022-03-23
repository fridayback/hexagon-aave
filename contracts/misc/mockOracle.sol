// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol'; 

/**
 * @title IPriceOracleGetter interface
 * @notice Interface for the Aave price oracle.
 **/

contract MockOracle is  IPriceOracleGetter{

   mapping(address=>uint256) public priceData;
   address public owner;

   constructor()public{
       owner = msg.sender;
   }

   function setPrice(address [] memory assets, uint256[] memory prices) external {

       require(assets.length == prices.length, '');
       require(msg.sender == owner, 'not owner');

       for(uint256 i = 0; i< assets.length; i++){
           priceData[assets[i]] = prices[i];
       }

   }

  function getAssetPrice(address asset) external override view returns (uint256){
      return priceData[asset];
  }

}