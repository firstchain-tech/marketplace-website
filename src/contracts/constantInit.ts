import Web3 from 'web3'
import { useConstant, FundSplitter_ABI, Market_ABI, Categories_ABI, MarketSharedToken_ABI, USDT_ABI } from './constant'

export interface ConstantBallTypes {
  ContractFundSplitter: any
  ContractMarketSharedToken: any
  ContractCategories: any
  ContractMarket: any
  ContractUsdt: any
}

export interface ConstantInitTypes {
  web3: Web3
  FundSplitter_ADDRESS: string
  SharedToken_ADDRESS: string
  Categories_ADDRESS: string
  Market_ADDRESS: string
  constant: ConstantBallTypes
  toWeiFromWei: (s: any) => void
  toWeiFromMwei: (s: any) => void
  minimumSaleAmount: number
  marketPageSize: number
  myNftPageSize: number
  license: string
  Blockchain: string
  payTokenOptions: any[]
  apiUrl: string
  apiKey: string
}

export class ConstantInit {
  web3: Web3
  FundSplitter_ADDRESS: string
  SharedToken_ADDRESS: string
  Categories_ADDRESS: string
  Market_ADDRESS: string
  constant: ConstantBallTypes
  minimumSaleAmount: number
  marketPageSize: number
  myNftPageSize: number
  license: string
  Blockchain: string
  payTokenOptions: any[]
  apiUrl: string
  apiKey: string

  constructor(provider: any, chainId: string) {
    const { REACT_APP_ENV = 'prd' } = process.env
    const {
      USDT_ADDRESS,
      FundSplitter_ADDRESS,
      SharedToken_ADDRESS,
      Market_ADDRESS,
      Categories_ADDRESS,
      Blockchain,
      payTokenOptions,
      apiUrl,
      apiKey,
    } = useConstant[chainId]
    this.web3 = new Web3(provider)
    this.payTokenOptions = payTokenOptions
    this.Blockchain = Blockchain
    this.apiKey = apiKey
    this.apiUrl = apiUrl
    this.FundSplitter_ADDRESS = FundSplitter_ADDRESS
    this.SharedToken_ADDRESS = SharedToken_ADDRESS
    this.Market_ADDRESS = Market_ADDRESS
    this.Categories_ADDRESS = Categories_ADDRESS
    this.constant = {
      ContractFundSplitter: new this.web3.eth.Contract(FundSplitter_ABI, FundSplitter_ADDRESS),
      ContractCategories: new this.web3.eth.Contract(Categories_ABI, Categories_ADDRESS),
      ContractMarketSharedToken: new this.web3.eth.Contract(MarketSharedToken_ABI, SharedToken_ADDRESS),
      ContractMarket: new this.web3.eth.Contract(Market_ABI, Market_ADDRESS),
      ContractUsdt: new this.web3.eth.Contract(USDT_ABI, USDT_ADDRESS),
    }
    this.license = (process.env as any).REACT_APP_LICENSE
    console.log('REACT_APP_ENV', REACT_APP_ENV)
    this.minimumSaleAmount = (process.env as any).REACT_APP_MINIMUMSALEAMOUNT
    this.marketPageSize = (process.env as any).REACT_APP_MARKETPAGESIZE
    this.myNftPageSize = (process.env as any).REACT_APP_MYNFTPAGESIZE
  }

  toWeiFromWei = (number: any) => {
    let data = this.web3.utils.fromWei(number, 'ether')
    return Number(data).toFixed(6)
  }

  toWeiFromMwei = (number: any) => {
    let data = this.web3.utils.fromWei(number, 'mwei')
    return Number(data).toFixed(6)
  }
}
