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
  1337: 'http://47.108.77.85:8545',
}

export const injected = new InjectedConnector({ supportedChainIds: [42, 97, 1337] })

// export const walletconnect = new WalletConnectConnector({
//   rpc: { 42: RPC_URLS[42], 97: RPC_URLS[97], 1337: RPC_URLS[1337] },
//   qrcode: true,
//   supportedChainIds: [42, 97, 1337],
//   // chainId: 1337,
// })
export const walletconnect = (rpc: any, chainId: number) => {
  return new WalletConnectConnector({
    rpc,
    chainId,
    qrcode: true,
    infuraId: '9aa3d95b3bc440fa88ea12eaa4456161',
  })
}

export const network = new NetworkConnector({
  urls: { 42: RPC_URLS[42], 97: RPC_URLS[97], 1337: RPC_URLS[1337] },
  defaultChainId: 1337,
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.NetWork]: network,
}

export const defaultChainId = 1337

export const useConstant = {
  42: {
    CHAIN_ID: 42,
    Blockchain: 'Kovan',
    RPC_URL: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    FundSplitter_ADDRESS: '0xC9875A2ddd8C15C38C16Ed62C843b161311e002A',
    SharedToken_ADDRESS: '0xfc9d43c6871407125eE53cFB04B9f5b18b81eeFc',
    Market_ADDRESS: '0x80e6DBd53Fc53fE22Eb30Ef864f1071fC6BDe9c1',
    Categories_ADDRESS: '0x6d8F17d45DC8e324dB6b05413CFB5467437A8A3b',
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
    FundSplitter_ADDRESS: '0x35a2a6b09ECf23373472e79b585558181BBE8670',
    SharedToken_ADDRESS: '0x98308B0348641436c8ebC3cbd4102C1CC1A5B92e',
    Market_ADDRESS: '0xBf9b757FA138A17DcD2789C9b2fe32B77115A521',
    Categories_ADDRESS: '0x356F50Dbf021af6E9702b37E26A128EFe617f73C',
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
  1337: {
    CHAIN_ID: 1337,
    Blockchain: 'Test',
    RPC_URL: 'http://47.108.77.85:8545',
    FundSplitter_ADDRESS: '0x7a99Df1550201f30425f47e115B71552f5ccebb5',
    SharedToken_ADDRESS: '0xAaFc5De77976aBfb2c6dF85e1AaD980d40A407a9',
    Market_ADDRESS: '0xE266c3fc0e641942015593ac6Da2F528ddBD8373',
    Categories_ADDRESS: '0x3E0343cf180A6b4A375b2A51487d0156C80212CD',
    USDT_ADDRESS: '0x7ac1086ADf413ce422Ee6417c638ED3D4da3A55e',
    payTokenOptions: [
      {
        value: '0x0000000000000000000000000000000000000000',
        label: 'ETH',
      },
      {
        value: '0x7ac1086ADf413ce422Ee6417c638ED3D4da3A55e',
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
  1337: {
    chainId: web3.utils.numberToHex(1337),
    isSwitch: true,
  },
}
