const { saveDeploy, getConfig, getContractAddr, getOracleParamPairs } = require('../utils');

const BigNumber = require('bignumber.js');
const { tokenToString } = require('typescript');

task('deposit', 'deposit token into pool')
  .addParam("token", "token name,eg. USDT,WETH,WAVAX")
  .addParam("amount", "how many tokens to be deposited")
  .addOptionalParam("account", "The operator account", 0,types.int)
  .setAction(async ({ token, amount,account }) => {

    const accounts = await hre.ethers.getSigners();

    const chainId = await hre.getChainId();
    const config = getConfig(chainId).ReservesConfig[token];
    if(!config) {
        console.log(`${token} is not supported`);
        return;
    }//underlying

    let reserve = config.underlying;
    // console.log(`deposit reserve: [${reserve}] for ${amount} for account: ${accounts[account].address}`);
    let erc20 = await hre.ethers.getContractFactory('ERC20',accounts[account]);
    erc20 = await erc20.attach(reserve);
    let decimals = await erc20.decimals();
    let amountOx = '0x'+new BigNumber(amount).shiftedBy(decimals).toString(16);

    // console.log(`decimals: ${decimals}\n`,getContractAddr(chainId,'LendingPool'),amountOx);

    await(await erc20.approve(getContractAddr(chainId,'LendingPool'),amountOx)).wait(1);
    let symbol = await erc20.symbol();
    console.log(`approve ${token} to ${reserve} for ${amount} ${symbol}`);

    let lendingPool = await hre.ethers.getContractFactory('LendingPool'
    ,{
      signer: accounts[account],
      libraries: {
        'ReserveLogic': getContractAddr(chainId, 'ReserveLogic'),
        // 'GenericLogic': getContractAddr(chainId, 'GenericLogic'),
        'ValidationLogic': getContractAddr(chainId, 'ValidationLogic')
    }});
    lendingPool= await lendingPool.attach(getContractAddr(chainId,'LendingPool'));
    // console.log(lendingPool);

    await (await lendingPool.deposit(reserve,amountOx,accounts[account].address,'0x0')).wait(1);
    console.log(`deposit reserve: [${reserve}] for ${amount} ${symbol} for account: ${accounts[account].address}`);

  });