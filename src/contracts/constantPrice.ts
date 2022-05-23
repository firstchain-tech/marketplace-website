import { IUniswapV2Pair_ABI } from './constant'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

const bsc_provider = 'https://bsc-dataseed1.defibit.io'
const main_provider = 'https://mainnet.infura.io/v3/a7f8896fe82b4c23941d8035590d9f01'

const eth_usdt_pair = '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852'
const busd_bnb_pair = '0x1EbF0eE99971c6269062C3b480e8e23B7A74756B'

const bsc_web3 = new Web3(bsc_provider)
const main_web3 = new Web3(main_provider)

const eth_usdt_pair_contract = new main_web3.eth.Contract(IUniswapV2Pair_ABI, eth_usdt_pair)

const busd_bnb_pair_contract = new bsc_web3.eth.Contract(IUniswapV2Pair_ABI, busd_bnb_pair)

const getReserves = async (ContractObj: any) => {
  const _reserves = await ContractObj.methods.getReserves().call()

  return [new BigNumber(_reserves.reserve0), new BigNumber(_reserves.reserve1)]
}

export const getEthPrice = async () => {
  const [eth, usdt] = await getReserves(eth_usdt_pair_contract)
  let proportion = eth.div(usdt).div(1000000000000).toFixed(6)
  let priceProportion = new BigNumber('1').div(proportion).toFixed(6)
  return priceProportion
}

export const getBscPrice = async () => {
  const [bsc, usdt] = await getReserves(busd_bnb_pair_contract)
  let proportion = bsc.div(usdt).toFixed(6)
  let priceProportion = new BigNumber('1').div(proportion).toFixed(6)
  return priceProportion
}
