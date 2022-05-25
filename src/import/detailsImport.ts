import { CardType, ArrRequestType } from '@/common/data'
import { MarketSharedToken_ABI } from '@/contracts/constant'
import Web3 from 'web3'
import { objArrayDuplicateRemoval } from '@/utils'
import { readGetApiEvents, readGetPastEvents, blockToTimestamp } from '@/common'
import { getOwendTokendsMarketData } from '@/import/owendTokens'

const ABILIST: any = {
  721: MarketSharedToken_ABI,
}

const ABILIST_ID: any = {
  721: '0x80ac58cd',
}

interface OpenBoxType {
  key?: string
  price: any
  to: string
  from: string
  blockNumber: string
  index?: number
  time: string
  unit: string
}

export interface DetailsImportType {
  Market_ADDRESS: string
  payTokenOptions: any[]
  toWeiFromWei: any
  currentDetails: CardType
  web3: Web3
  collectibleAddedData: any[]
  collectibleRemovedData: any[]
  purchasedData: any[]
  toWeiFromMwei: any
}

export const detailsImport = async ({
  Market_ADDRESS,
  payTokenOptions,
  toWeiFromWei,
  currentDetails,
  web3,
  collectibleAddedData,
  collectibleRemovedData,
  purchasedData,
  toWeiFromMwei,
}: DetailsImportType) => {
  console.log('currentDetails', currentDetails)
  if (currentDetails.contracts_type === 721) {
    let constantWeb3 = new web3.eth.Contract(ABILIST[currentDetails.contracts_type], currentDetails.contracts)
    let isTrue = await constantWeb3.methods.supportsInterface(ABILIST_ID[currentDetails.contracts_type]).call()
    if (isTrue) {
      console.log('purchasedData', purchasedData)
      return await detailsImportTwo({
        Market_ADDRESS,
        payTokenOptions,
        toWeiFromWei,
        currentDetails,
        web3,
        toWeiFromMwei,
        collectibleAddedData: collectibleAddedData.filter(
          (item) => item.collection.toLowerCase() === (currentDetails.contracts as any).toLowerCase(),
        ),
        collectibleRemovedData: collectibleRemovedData.filter(
          (item) => item.collection.toLowerCase() === (currentDetails.contracts as any).toLowerCase(),
        ),
        purchasedData: purchasedData.filter((item) => item.collection.toLowerCase() === (currentDetails.contracts as any).toLowerCase()),
        contract: constantWeb3,
      })
    } else return await []
  } else return await []
}

export const detailsImportTwo = async ({
  Market_ADDRESS,
  payTokenOptions,
  toWeiFromWei,
  toWeiFromMwei,
  currentDetails,
  web3,
  collectibleAddedData,
  collectibleRemovedData,
  purchasedData,
  contract,
}: DetailsImportType & {
  contract: any
}) => {
  console.log('collectibleAddedData,collectibleRemovedData, purchasedData,', collectibleAddedData, collectibleRemovedData, purchasedData)
  let transferSource: any = await readGetPastEvents(contract, 'Transfer')
  let transferMyCreateData: any[] = []
  let transferSourceDataArr: any[] = []
  console.log('transferSource', transferSource)
  for (let i = 0; i < transferSource.data.length; i++) {
    let element = transferSource.data[i]
    if (
      element.returnValues.from === '0x0000000000000000000000000000000000000000' &&
      element.returnValues.tokenId === currentDetails.tokenId
    ) {
      let time = await blockToTimestamp(web3, element.blockNumber.toString())
      let obj = {
        index: '-1',
        blockNumber: element.blockNumber,
        price: '-',
        from: element.returnValues.from,
        to: element.returnValues.to,
        time,
        unit: '',
      }
      transferMyCreateData.push(obj)
    } else {
      if (
        element.returnValues.from === '0x0000000000000000000000000000000000000000' ||
        element.returnValues.to === '0x0000000000000000000000000000000000000000'
      ) {
      } else {
        transferSourceDataArr.push({
          from: element.returnValues.from,
          to: element.returnValues.to,
          tokenId: element.returnValues.tokenId,
          index: i,
          blockNumber: element.blockNumber,
        })
      }
    }
  }
  let arr: any[] = collectibleAddedData.filter(
    (item) => !collectibleRemovedData.some((ele) => ele.collectibleHash === item.collectibleHash),
  )
  let arr2: any[] = objArrayDuplicateRemoval(
    arr.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  let arr3: any[] = objArrayDuplicateRemoval(
    transferSourceDataArr.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  let marketOwnedTokens = await getOwendTokendsMarketData(arr2, arr3, Market_ADDRESS)
  let data1: any[] = arr.filter((item) => !arr2.some((ele: any) => ele.blockNumber === item.blockNumber))
  let data2: any[] = arr2.filter((item) => !marketOwnedTokens.some((ele: any) => ele === item.tokenId))
  let allSaleSuccessList: any[] = [...data1, ...data2]
  allSaleSuccessList.sort(function (a: any, b: any) {
    return b.blockNumber - a.blockNumber
  })
  console.log('allSaleSuccessList', allSaleSuccessList)
  let DATA_LIST: any[] = []
  for (let i = 0; i < allSaleSuccessList.length; i++) {
    let item = allSaleSuccessList[i]
    if (item.tokenId === currentDetails.tokenId) {
      if (DATA_LIST.length >= 10) continue
      let currentPurchaseInfo = purchasedData.find((pi) => pi.collectibleHash.toLowerCase() === item.collectibleHash.toLowerCase())
      if (currentPurchaseInfo === undefined) continue
      let time = await blockToTimestamp(web3, currentPurchaseInfo.blockNumber)
      let unit = payTokenOptions.find((pi) => pi.value === item.currency).label
      let price = unit === 'USDT' ? toWeiFromMwei(item.price) : toWeiFromWei(item.price)
      let obj: OpenBoxType = {
        index: item.index,
        blockNumber: currentPurchaseInfo.blockNumber,
        price,
        from: item.seller,
        to: currentPurchaseInfo.purchaser,
        time,
        unit,
      }
      DATA_LIST.push(obj)
    }
  }
  if (DATA_LIST.length < 10) DATA_LIST.push(...transferMyCreateData)
  DATA_LIST.sort(function (a: any, b: any) {
    return b.blockNumber - a.blockNumber
  })

  return await DATA_LIST
}

/** api url */
export interface DetailsImportApiType {
  Market_ADDRESS: string
  payTokenOptions: any[]
  toWeiFromWei: any
  currentDetails: CardType
  apiKey: string
  apiUrl: string
  web3: Web3
  collectibleAddedData: any[]
  collectibleRemovedData: any[]
  purchasedData: any[]
  toWeiFromMwei: any
}

export const detailsImportApi = async ({
  Market_ADDRESS,
  payTokenOptions,
  toWeiFromWei,
  currentDetails,
  apiKey,
  apiUrl,
  web3,
  collectibleAddedData,
  collectibleRemovedData,
  purchasedData,
  toWeiFromMwei,
}: DetailsImportApiType) => {
  if (currentDetails.contracts_type === 721) {
    let constantWeb3 = new web3.eth.Contract(ABILIST[currentDetails.contracts_type], currentDetails.contracts)
    let isTrue = await constantWeb3.methods.supportsInterface(ABILIST_ID[currentDetails.contracts_type]).call()
    if (isTrue) {
      return await detailsImportApiTwo({
        Market_ADDRESS,
        payTokenOptions,
        toWeiFromWei,
        currentDetails,
        apiKey,
        apiUrl,
        web3,
        collectibleAddedData,
        collectibleRemovedData,
        purchasedData,
        toWeiFromMwei,
      })
    } else return await []
  } else return await []
}

export const detailsImportApiTwo = async ({
  Market_ADDRESS,
  payTokenOptions,
  toWeiFromWei,
  currentDetails,
  apiKey,
  apiUrl,
  web3,
  toWeiFromMwei,
  collectibleAddedData,
  collectibleRemovedData,
  purchasedData,
}: DetailsImportApiType) => {
  let topic0Transfer = await web3.utils.sha3('Transfer(address,address,uint256)')
  let arrRequest: ArrRequestType[] = [
    { address: currentDetails.contracts as any, apiKey, apiUrl, topic0: topic0Transfer, eventNme: 'Transfer' },
  ]
  let arrPromis: any[] = await Promise.all([readGetApiEvents(arrRequest[0])])
  let transferSource: any = arrPromis[0].result

  let transferMyCreateData: any[] = []
  let transferSourceDataArr: any[] = []
  for (let i = 0; i < transferSource.length; i++) {
    let element = transferSource[i]
    let tokenId = web3.utils.hexToNumber(element.topics[3])
    let data: any = {
      from: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
      to: `0x${element.topics[2].substring(26, element.topics[2].length)}`,
      tokenId: tokenId.toString(),
    }
    if (data.from === '0x0000000000000000000000000000000000000000' && data.tokenId === currentDetails.tokenId) {
      let blockNumber = web3.utils.hexToNumber(element.blockNumber)
      console.log('element.blockNumber', blockNumber)
      let time = await blockToTimestamp(web3, blockNumber.toString())
      let obj = {
        index: '-1',
        blockNumber,
        price: '-',
        from: data.from,
        to: data.to,
        time,
        unit: '',
      }
      transferMyCreateData.push(obj)
    } else {
      if (data.from === '0x0000000000000000000000000000000000000000' || data.to === '0x0000000000000000000000000000000000000000') {
      } else {
        let blockNumber = web3.utils.hexToNumber(element.blockNumber)
        transferSourceDataArr.push({
          from: data.from,
          to: data.to,
          tokenId: data.tokenId,
          index: i,
          blockNumber,
        })
      }
    }
  }
  let arr: any[] = collectibleAddedData.filter(
    (item) => !collectibleRemovedData.some((ele) => ele.collectibleHash.toLowerCase() === item.collectibleHash.toLowerCase()),
  )
  let arr2: any[] = objArrayDuplicateRemoval(
    arr.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )

  let arr3: any[] = objArrayDuplicateRemoval(
    transferSourceDataArr.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  let marketOwnedTokens = await getOwendTokendsMarketData(arr2, arr3, Market_ADDRESS)
  let data1: any[] = arr.filter((item) => !arr2.some((ele: any) => ele.blockNumber === item.blockNumber))
  let data2: any[] = arr2.filter((item) => !marketOwnedTokens.some((ele: any) => ele === item.tokenId))
  console.log('data2', data2)
  let allSaleSuccessList: any[] = [...data1, ...data2]
  allSaleSuccessList.sort(function (a: any, b: any) {
    return b.blockNumber - a.blockNumber
  })
  let DATA_LIST: any[] = []
  for (let i = 0; i < allSaleSuccessList.length; i++) {
    let item = allSaleSuccessList[i]
    if (item.tokenId === currentDetails.tokenId) {
      if (DATA_LIST.length >= 10) continue
      let currentPurchaseInfo = purchasedData.find((pi) => pi.collectibleHash.toLowerCase() === item.collectibleHash.toLowerCase())
      let time = await blockToTimestamp(web3, currentPurchaseInfo.blockNumber)
      let unit = payTokenOptions.find((pi) => pi.value === item.currency).label
      let price = unit === 'USDT' ? toWeiFromMwei(item.price) : toWeiFromWei(item.price)
      let obj: OpenBoxType = {
        index: item.index,
        blockNumber: currentPurchaseInfo.blockNumber,
        price,
        from: item.seller,
        to: currentPurchaseInfo.purchaser,
        time,
        unit,
      }
      DATA_LIST.push(obj)
    }
  }
  if (DATA_LIST.length < 10) DATA_LIST.push(...transferMyCreateData)
  DATA_LIST.sort(function (a: any, b: any) {
    return b.blockNumber - a.blockNumber
  })
  return await DATA_LIST
}
