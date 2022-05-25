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
    FundSplitter_ADDRESS: '0x979cb520C96824d058e3A244a6DB2E651F7381B2',
    SharedToken_ADDRESS: '0x9BD9Ae21055ec7F6860D15E5eb2FE41E220a4f4f',
    Market_ADDRESS: '0x9F81838232F977b89f1b7011060145dA2EDaE92e',
    Categories_ADDRESS: '0x7f416fb6996F9D2EB35DC561d4C61F8d1565F710',
    USDT_ADDRESS: '0x329DfE37F866367f0652786848885F3AFC90cCC6',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'ETH',
      },
      {
        value: '0x329DfE37F866367f0652786848885F3AFC90cCC6',
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
    FundSplitter_ADDRESS: '0xc46B9140fa2De801c3e77FD283B5E0CFDDc93107',
    SharedToken_ADDRESS: '0x4819F739f3F78e7990d5FDa9B5F6445f0c0F3eFA',
    Market_ADDRESS: '0xe32D95131846a57a78F904b8e8a6e2f2E39a8e35',
    Categories_ADDRESS: '0xBe450fb22A8753C95fE58B1081F682d4d7b01B9d',
    USDT_ADDRESS: '0x660558d9e0858c077196542E50638F228690a963',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'BNB',
      },
      {
        value: '0x660558d9e0858c077196542E50638F228690a963',
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
    FundSplitter_ADDRESS: '0xf50C7B91E584BD2a62f5D099F53E85935B3B444d',
    SharedToken_ADDRESS: '0x3cfd007FEA893F36f5B39c1cFd3CF0Df4891a320',
    Market_ADDRESS: '0x027F1bF5678f4422639969Eb2d47A44DfC14c9AA',
    Categories_ADDRESS: '0x2Ed91A55A3ed0A32656BbC256edf818670a231dF',
    USDT_ADDRESS: '',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'METIS',
      },
    ],
    apiUrl: '',
    apiKey: '',
  },
  2153: {
    CHAIN_ID: 2153,
    Blockchain: 'Findora',
    RPC_URL: 'https://prod-testnet.prod.findora.org:8545/',
    FundSplitter_ADDRESS: '0x027F1bF5678f4422639969Eb2d47A44DfC14c9AA',
    SharedToken_ADDRESS: '0x2Ed91A55A3ed0A32656BbC256edf818670a231dF',
    Market_ADDRESS: '0xD02F272978a596EDb3E5D9E8270d7b67cE55feb2',
    Categories_ADDRESS: '0xDE7443f3b529e73B5FC3F9547f732da70Be3aA2D',
    USDT_ADDRESS: '',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'FRA',
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
