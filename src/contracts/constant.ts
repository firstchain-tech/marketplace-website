import * as prdConstants from './constant.prd'
import * as uatConstants from './constant.uat'
import * as devConstants from './constant.dev'
import { NetWorkObj } from './init'
import Categories from './abis/Categories.json'
import FundSplitter from './abis/FundSplitter.json'
import Market from './abis/Market.json'
import MarketSharedToken from './abis/MarketSharedToken.json'
import USDT from './abis/USDT.json'
import IUniswapV2Pair from './abis/IUniswapV2Pair.json'

const constants: any = {
  prd: prdConstants,
  uat: uatConstants,
  dev: devConstants,
}

export interface ConnectorNamesType {
  src: 'Injected' | 'WalletConnect' | 'NetWork'
}

const { REACT_APP_ENV = 'prd' } = process.env
export const { useConstant, RPC_URLS, injected, walletconnect, network, connectorsByName, defaultChainId, netWorks } =
  constants[REACT_APP_ENV]

export const netWorkInit = NetWorkObj[REACT_APP_ENV]

export const Categories_ABI: any = Categories
export const Market_ABI: any = Market
export const FundSplitter_ABI: any = FundSplitter
export const MarketSharedToken_ABI: any = MarketSharedToken
export const USDT_ABI: any = USDT
export const IUniswapV2Pair_ABI: any = IUniswapV2Pair

export const getActiveChainId = (arr: any, network: any) => {
  let objChainId = Object.keys(arr)
  let isTrue = objChainId.some((item) => item === network.toString())
  return isTrue
}
