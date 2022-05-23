import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import Web3 from 'web3'

const web3 = new Web3(Web3.givenProvider)

enum ConnectorNames {
  Injected = 'Injected',
  WalletConnect = 'WalletConnect',
  NetWork = 'NetWork',
}

export interface ConnectorNamesType {
  src: 'Injected' | 'WalletConnect' | 'NetWork'
}

export const RPC_URLS: { [chainId: number]: string } = {
  42: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  588: 'https://stardust.metis.io/?owner=588',
  2153: 'https://prod-testnet.prod.findora.org:8545/',
}

export const injected = new InjectedConnector({ supportedChainIds: [42, 97, 588, 2153] })

export const walletconnect = (rpc: any, chainId: number) => {
  return new WalletConnectConnector({
    rpc,
    chainId,
    qrcode: true,
    infuraId: '9aa3d95b3bc440fa88ea12eaa4456161',
  })
}

export const network = new NetworkConnector({
  urls: { 42: RPC_URLS[42], 97: RPC_URLS[97], 588: RPC_URLS[588], 2153: RPC_URLS[2153] },
  defaultChainId: 42,
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.NetWork]: network,
}

export const defaultChainId = 42

export const useConstant = {
  42: {
    CHAIN_ID: 42,
    Blockchain: 'Kovan',
    RPC_URL: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    FundSplitter_ADDRESS: '0x8b0D26226Df507e378848Fc7BF5f4D5c352Ca421',
    SharedToken_ADDRESS: '0x0C126337AE92e0D1847C524CA910ED64F133fC08',
    Market_ADDRESS: '0x30D98b26aA48EeE633249E2782cF7A50497CdE70',
    Categories_ADDRESS: '0x544ECd8bd975282e4AA6E5d0ab19DaC6328a0984',
    USDT_ADDRESS: '0x617D0a1f348be74605567394712818eCf0092322',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'ETH',
      },
      {
        value: '0x617D0a1f348be74605567394712818eCf0092322',
        label: 'USDT',
      },
    ],
    apiUrl: '',
    apiKey: '',
  },
  97: {
    CHAIN_ID: 97,
    Blockchain: 'Binance',
    RPC_URL: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    FundSplitter_ADDRESS: '0x43Ca805dC7Da67b7810E7A7cC236133c59a36812',
    SharedToken_ADDRESS: '0x18E3FFf13cd8be87c43AcC1bC41D3524d3358C7F',
    Market_ADDRESS: '0x959Ac557058f1Fc5F88941B07c3FAB0fF665b3D2',
    Categories_ADDRESS: '0x5F78562A76b3DAE24Dd6bE6aEeE234B40825F282',
    USDT_ADDRESS: '0xCa6FcDffcA35dDAba72Ef45feAe6ef76561dfCC6',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'BNB',
      },
      {
        value: '0xCa6FcDffcA35dDAba72Ef45feAe6ef76561dfCC6',
        label: 'USDT',
      },
    ],
    apiUrl: 'https://api-testnet.bscscan.com/api',
    apiKey: '366TDMB1M11NCFABM78212QFUM81INYK1C',
  },
  588: {
    CHAIN_ID: 588,
    Blockchain: 'Metis',
    RPC_URL: 'https://stardust.metis.io/?owner=588',
    FundSplitter_ADDRESS: '0xC08fb7fa095dF6A59C5AB64653E01bcAf8c84ce0',
    SharedToken_ADDRESS: '0xc1D431c805cc2Ceb31F4395BFf5625135Aa6ABbF',
    Market_ADDRESS: '0x1B1acE837a3822a8724193F010C58fA583D56127',
    Categories_ADDRESS: '0x6C840856C8dfDf42e963Ed2c6838c9B52F8b84DA',
    USDT_ADDRESS: '0x5737Fa09Bd22FF535147E8d276c4F9c09ec45088',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'METIS',
      },
      {
        value: '0x5737Fa09Bd22FF535147E8d276c4F9c09ec45088',
        label: 'USDT',
      },
    ],
    apiUrl: '',
    apiKey: '',
  },
  2153: {
    CHAIN_ID: 2153,
    Blockchain: 'Findora',
    RPC_URL: 'https://prod-testnet.prod.findora.org:8545/',
    FundSplitter_ADDRESS: '0xC08fb7fa095dF6A59C5AB64653E01bcAf8c84ce0',
    SharedToken_ADDRESS: '0xc1D431c805cc2Ceb31F4395BFf5625135Aa6ABbF',
    Market_ADDRESS: '0x1B1acE837a3822a8724193F010C58fA583D56127',
    Categories_ADDRESS: '0x6C840856C8dfDf42e963Ed2c6838c9B52F8b84DA',
    USDT_ADDRESS: '0x47d747bcF08A47a9d0bEA0a4bCed793a3f4E38a8',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'FRA',
      },
      {
        value: '0x47d747bcF08A47a9d0bEA0a4bCed793a3f4E38a8',
        label: 'USDT',
      },
    ],
    apiUrl: '',
    apiKey: '',
  },
}

export const netWorks = {
  42: {
    chainId: web3.utils.numberToHex(42),
    isSwitch: true,
  },
  97: {
    chainId: web3.utils.numberToHex(97),
    chainName: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'Bnb',
      symbol: 'Bnb',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  588: {
    chainId: web3.utils.numberToHex(588),
    chainName: 'Metis Testnet',
    nativeCurrency: {
      name: 'METIS',
      symbol: 'METIS',
      decimals: 18,
    },
    rpcUrls: ['https://stardust.metis.io/?owner=588'],
    blockExplorerUrls: ['https://stardust-explorer.metis.io'],
  },
  2153: {
    chainId: web3.utils.numberToHex(2153),
    chainName: 'Findora Testnet',
    nativeCurrency: {
      name: 'FRA',
      symbol: 'FRA',
      decimals: 18,
    },
    rpcUrls: ['https://prod-testnet.prod.findora.org:8545/'],
    blockExplorerUrls: ['https://prod-testnet.findorascan.io/'],
  },
}
