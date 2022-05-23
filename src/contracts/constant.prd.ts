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
  1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  56: 'https://bsc-dataseed1.binance.org',
  // 2152: 'https://prod-mainnet.prod.findora.org:8545',
  // 1088: 'https://andromeda.metis.io/?owner=1088',
}

// , 2152, 1088
export const injected = new InjectedConnector({ supportedChainIds: [1, 56] })

// export const walletconnect = new WalletConnectConnector({
//   rpc: { 1: RPC_URLS[1], 56: RPC_URLS[56], 2152: RPC_URLS[2152], 1088: RPC_URLS[1088] },
//   qrcode: true,
//   supportedChainIds: [1, 56, 2152, 1088],
//   // chainId: 56,
// })

export const walletconnect = (rpc: any, chainId: number) => {
  return new WalletConnectConnector({
    rpc,
    chainId,
    qrcode: true,
    infuraId: '9aa3d95b3bc440fa88ea12eaa4456161',
  })
}

// , 2152: RPC_URLS[2152], 1088: RPC_URLS[1088]
export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 56: RPC_URLS[56] },
  defaultChainId: 56,
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.NetWork]: network,
}

export const defaultChainId = 1

export const useConstant = {
  1: {
    CHAIN_ID: 1,
    Blockchain: 'Ethereum',
    RPC_URL: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    FundSplitter_ADDRESS: '0xB56EEF8B3c972dC8dC91425A7fa8e5E61A4DdefC',
    SharedToken_ADDRESS: '0xFc41F4e5ec957FB7f40311fB27869D361f756f43',
    Market_ADDRESS: '0xF7d40555aB60d48705CD21001933df665a343A03',
    Categories_ADDRESS: '0xFCeF3f210e502b9F3E75e0620e70eC5150eD4a39',
    USDT_ADDRESS: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'ETH',
      },
      {
        value: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        label: 'USDT',
      },
    ],
    apiUrl: '',
    apiKey: '',
  },
  56: {
    CHAIN_ID: 56,
    Blockchain: 'BNB Chain',
    RPC_URL: 'https://bsc-dataseed1.binance.org',
    FundSplitter_ADDRESS: '0x8E16875d55DcD211924E165fd29577B450B64a03',
    SharedToken_ADDRESS: '0x9726F69aF2B1076B26528007E53aD3EFDc87F902',
    Market_ADDRESS: '0xF260f03afF9d430f402dF6384C6dD49A792d9d42',
    Categories_ADDRESS: '0xd9c9Ad5306744766f9958646E229DcE736fBEc61',
    USDT_ADDRESS: '0x55d398326f99059ff775485246999027b3197955',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'BNB',
      },
      {
        value: '0x55d398326f99059fF775485246999027B3197955',
        label: 'USDT',
      },
    ],
    apiUrl: 'https://api.bscscan.com/api',
    apiKey: '366TDMB1M11NCFABM78212QFUM81INYK1C',
  },
  // 2152: {
  //   CHAIN_ID: 2152,
  //   Blockchain: 'Findora',
  //   RPC_URL: 'https://prod-mainnet.prod.findora.org:8545',
  //   FundSplitter_ADDRESS: '',
  //   SharedToken_ADDRESS: '',
  //   Market_ADDRESS: '',
  //   Categories_ADDRESS: '',
  //   USDT_ADDRESS: '',
  //   payTokenOptions: [
  //     {
  //       value: '0x0000000000000000000000000000000000000000',
  //       label: 'FRA',
  //     },
  //     {
  //       value: '',
  //       label: 'USDT',
  //     },
  //   ],
  //   apiUrl: '',
  //   apiKey: '',
  // },
  // 1088: {
  //   CHAIN_ID: 1088,
  //   Blockchain: 'Metis',
  //   RPC_URL: 'https://andromeda.metis.io/?owner=1088',
  //   FundSplitter_ADDRESS: '',
  //   SharedToken_ADDRESS: '',
  //   Market_ADDRESS: '',
  //   Categories_ADDRESS: '',
  //   USDT_ADDRESS: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC',
  //   payTokenOptions: [
  //     {
  //       value: '0x0000000000000000000000000000000000000000',
  //       label: 'METIS',
  //     },
  //     {
  //       value: '0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC',
  //       label: 'USDT',
  //     },
  //   ],
  //   apiUrl: '',
  //   apiKey: '',
  // },
}

export const netWorks = {
  1: {
    chainId: web3.utils.numberToHex(1),
    isSwitch: true,
  },
  56: {
    chainId: web3.utils.numberToHex(56),
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  // 2152: {
  //   chainId: web3.utils.numberToHex(2152),
  //   chainName: 'Findora Mainnet',
  //   nativeCurrency: {
  //     name: 'FRA',
  //     symbol: 'FRA',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://prod-mainnet.prod.findora.org:8545'],
  //   blockExplorerUrls: ['https://prod-mainnet01-blockscout.prod.findora.org'],
  // },
  // 1088: {
  //   chainId: web3.utils.numberToHex(1088),
  //   chainName: 'Metis Andromeda Mainnet',
  //   nativeCurrency: {
  //     name: 'METIS',
  //     symbol: 'METIS',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
  //   blockExplorerUrls: ['https://andromeda-explorer.metis.io'],
  // },
}
