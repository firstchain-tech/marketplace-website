import Web3 from 'web3'
// import WalletConnectProvider from '@walletconnect/ethereum-provider'
// import { getActiveChainId } from '@/contracts/constant'
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
  minimumSaleAmount: number
  nftPageSize: number
  tradePageSize: number
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
  nftPageSize: number
  tradePageSize: number
  myNftPageSize: number
  license: string
  Blockchain: string
  payTokenOptions: any[]
  apiUrl: string
  apiKey: string

  constructor(provider: any, chainId: string) {
    // let currentChainId: any = chainId
    // console.log('provider: any, chainId: string', provider, chainId)
    // if (provider instanceof WalletConnectProvider) {
    //   console.log('prps', provider)
    // }
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
    this.license =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBmMTIzNUNGRjVjMDYxMzFBNzk0MGZGMmJFYjc3QjEzNjcwODE1MUUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTEyMzMzMjU0MjQsIm5hbWUiOiJRUU5GVCJ9.IN54ITNlC1pX5pfrTp5g5_5On82eX_qCDx8GeY-YRBQQ'

    console.log('REACT_APP_ENV', REACT_APP_ENV)
    this.minimumSaleAmount = 0.000001
    this.nftPageSize = 15
    this.tradePageSize = 15
    this.myNftPageSize = 15
  }

  toWeiFromWei = (number: any) => {
    let data = this.web3.utils.fromWei(number, 'ether')
    return Number(data).toFixed(6)
  }
}
