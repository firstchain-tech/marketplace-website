export interface MenuListType {
  name: string
  enName: string
  url: string
  key: string
  index: number
  childList?: {
    name: string
    enName: string
    url: string
    title: string
    enTitle: string
    childList?: {
      name: string
      enName: string
      url: string
      title?: string
      enTitle?: string
    }[]
  }[]
}

export interface CardType {
  tokenId: string
  name: string
  image: string
  cover?: string
  description?: string
  serialNumber: any
  categoriesName?: string
  index?: any
  key?: string
  nameTheme?: string
  address?: string
  price?: string
  status?: string
  isSell?: boolean
  blockNumber?: string
  collection?: string
  isNftStatus?: boolean
  isSelfBuilt?: boolean
  collectibleHash?: string
  unit?: string
  royalty?: string
  royaltyAddress?: string
  time?: string
  isImport?: boolean
  contracts?: string
  contracts_type?: number
  isDefault?: boolean
}
/**
 * 可出售 -- 出售
 * 已出售 -- 取消  出售成功
 * status 前端显示状态 1 可出售 2 已出售 0 代表自建
 * isSell 是否出售 true
 * index 原来序号
 * collection 合约地址
 * isSelfBuilt 是否自建
 * unit 出售的单位 主要是 原生代币和usDT
 * isDefault 是否加载失败显示默认值
 */

export interface StatusType {
  value: string
  lable: string
}

export interface NftListType {
  value: string
  lable: string
  active: boolean
  key: string
}

export interface ArrRequestType {
  address: string
  apiKey: string
  apiUrl: string
  topic0: any
  eventNme: string
}
