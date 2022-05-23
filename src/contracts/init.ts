import BNB_ICON from '@/assets/token/BNB.svg'
import ETH_ICON from '@/assets/token/ETH.svg'
import FINDORA_ICON from '@/assets/token/findora.svg'
import METIS_ICON from '@/assets/token/metis.svg'
import METAMASK_ICON from '@/assets/svg/metamask.svg'
import WALLET_CONNECT_ICON from '@/assets/svg/wallet-connect.svg'
import BNB_MIN from '@/assets/token/Binance-min.svg'
import ETH_MIN from '@/assets/token/Ethereum-min.svg'
import METIS_MIN from '@/assets/token/metis-min.svg'
import FINDORA_MIN from '@/assets/token/findora-min.svg'
import type { StatusType, NftListType } from '@/common/data.d'
import { ImageError } from '@/common/init'
import ETH_ICON_PRICE from '@/assets/eth_icon.png'
import USDT_ICON_PRICE from '@/assets/svg/usdt.svg'
import BNB_ICON_PRICE from '@/assets/token/Binance-min.svg'
import METIS_ICON_PRICE from '@/assets/token/metis-min.svg'
import FINDORA_ICON_PRICE from '@/assets/token/findora-min.svg'

export interface listTypes {
  name: string
  icon: string
  chainId: any
  backgroundImage: string
  img: string
  fullName: string
}

export const NetWorkObj: any = {
  prd: [
    {
      name: 'Ethereum',
      fullName: 'Ethereum Mainnet',
      icon: ETH_ICON,
      img: ETH_MIN,
      chainId: 1,
      backgroundImage: 'linear-gradient(to right,#495EFC,#3F84EE)',
    },
    {
      name: 'BNB Chain',
      fullName: 'Binance Smart Chain',
      icon: BNB_ICON,
      img: BNB_MIN,
      chainId: 56,
      backgroundImage: 'linear-gradient(to right,#3E3F47,#525961)',
    },
    // {
    //   name: 'Metis',
    //   fullName: 'Metis Andromeda Mainnet',
    //   img: METIS_ICON,
    //   icon: METIS_MIN,
    //   backgroundImage: 'linear-gradient(73.28deg, #012033 6.51%, #012033 88.45%)',
    //   chainId: 1088,
    // },
    // {
    //   name: 'Findora',
    //   fullName: 'Findora Mainnet',
    //   img: FINDORA_ICON,
    //   icon: FINDORA_MIN,
    //   backgroundImage: 'linear-gradient(73.28deg, #8247E5 6.51%, #6027C0 88.45%)',
    //   chainId: 2152,
    // },
  ],
  dev: [
    {
      name: 'Kovan',
      fullName: 'Kovan Testnet',
      icon: ETH_ICON,
      img: ETH_MIN,
      chainId: 42,
      backgroundImage: 'linear-gradient(to right,#495EFC,#3F84EE)',
    },
    {
      name: 'Binance',
      fullName: 'BNB Smart Chain Testnet',
      icon: BNB_ICON,
      img: BNB_MIN,
      chainId: 97,
      backgroundImage: 'linear-gradient(to right,#3E3F47,#525961)',
    },
    {
      name: 'Test',
      fullName: '47 Test NetWork',
      icon: ImageError,
      img: ImageError,
      chainId: 1337,
      backgroundImage: 'linear-gradient(73.28deg, #012033 6.51%, #012033 88.45%)',
    },
  ],
  uat: [
    {
      name: 'Kovan',
      fullName: 'Kovan Testnet',
      icon: ETH_ICON,
      img: ETH_MIN,
      chainId: 42,
      backgroundImage: 'linear-gradient(to right,#495EFC,#3F84EE)',
    },
    {
      name: 'Binance',
      fullName: 'BNB Smart Chain Testnet',
      icon: BNB_ICON,
      img: BNB_MIN,
      chainId: 97,
      backgroundImage: 'linear-gradient(to right,#3E3F47,#525961)',
    },
    {
      name: 'Metis',
      fullName: 'Metis Stardust Testnet',
      img: METIS_ICON,
      icon: METIS_MIN,
      backgroundImage: 'linear-gradient(73.28deg, #012033 6.51%, #012033 88.45%)',
      chainId: 588,
    },
    {
      name: 'Findora',
      fullName: 'Findora Testnet',
      img: FINDORA_ICON,
      icon: FINDORA_MIN,
      backgroundImage: 'linear-gradient(73.28deg, #8247E5 6.51%, #6027C0 88.45%)',
      chainId: 2153,
    },
  ],
}

export const walletInit: { name: string; icon: string; link: string }[] = [
  {
    name: 'Metamask',
    link: 'Injected',
    icon: METAMASK_ICON,
  },
  {
    name: 'WalletConnect',
    link: 'WalletConnect',
    icon: WALLET_CONNECT_ICON,
  },
]

export const statusOptions: StatusType[] = [
  { value: '2', lable: 'Sale of' },
  { value: '1', lable: 'Purchase of' },
  { value: '', lable: 'My NFT' },
]

export const nftListStatusInit: NftListType[] = [
  {
    value: '1',
    lable: 'On sale',
    active: true,
    key: '0',
  },
  {
    value: '',
    lable: 'All NFT',
    active: false,
    key: '1',
  },
]

export const nftPriceIcon: any = {
  ETH: ETH_ICON_PRICE,
  BNB: BNB_ICON_PRICE,
  USDT: USDT_ICON_PRICE,
  FRA: FINDORA_ICON_PRICE,
  METIS: METIS_ICON_PRICE,
}

export const nftPriceIconColor: any = {
  BNB: '#F0B90B',
  USDT: '#009393',
  FRA: '#5C17E6',
  METIS: '#282945',
}
