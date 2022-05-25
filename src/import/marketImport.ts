import Web3 from 'web3'
import { MarketSharedToken_ABI } from '@/contracts/constant'
import type { PortfolioImportType } from '@/hooks/useMarketHooks'
import { readGetApiEvents, GetIPFSJson, blockToTimestamp, readGetPastEvents } from '@/common'
import { objArrayDuplicateRemoval } from '@/utils'
import type { CardType, ArrRequestType } from '@/common/data.d'
import BigNumber from 'bignumber.js'
import DEFAULT_IMG from '@/assets/default.png'
import { getOwendTokendsMarketData } from '@/import/owendTokens'

export interface MarketImportType {
  web3: Web3
  portfolioListImport: PortfolioImportType[]
  Market_ADDRESS: string
  ContractMarket: any
  apiKey: string
  apiUrl: string
  collectibleAddedSourceData: any[]
  collectibleRemovedSourceData: any[]
  collectiblePurchasedSourceSourceData: any[]
  payTokenOptions: any[]
}

export interface MarketImportTypeTwo {
  web3: Web3
  portfolioObj: PortfolioImportType
  Market_ADDRESS: string
  ContractMarket: any
  apiKey: string
  apiUrl: string
  collectibleAddedSourceData: any[]
  collectibleRemovedSourceData: any[]
  collectiblePurchasedSourceSourceData: any[]
  payTokenOptions: any[]
}

export const marketImport = async ({
  web3,
  portfolioListImport,
  Market_ADDRESS,
  ContractMarket,
  apiKey,
  apiUrl,
  collectibleAddedSourceData,
  collectibleRemovedSourceData,
  collectiblePurchasedSourceSourceData,
  payTokenOptions,
}: MarketImportType) => {
  let DATA_LIST: any[] = []
  for (let i = 0; i < portfolioListImport.length; i++) {
    let item = portfolioListImport[i]
    let list = await marketImportTwo({
      portfolioObj: item,
      web3,
      Market_ADDRESS,
      ContractMarket,
      apiKey,
      apiUrl,
      payTokenOptions,
      collectibleAddedSourceData: collectibleAddedSourceData.filter((pj) => pj.collection.toLowerCase() === item.contracts.toLowerCase()),
      collectibleRemovedSourceData: collectibleRemovedSourceData.filter(
        (pj) => pj.collection.toLowerCase() === item.contracts.toLowerCase(),
      ),
      collectiblePurchasedSourceSourceData: collectiblePurchasedSourceSourceData.filter(
        (pj) => pj.collection.toLowerCase() === item.contracts.toLowerCase(),
      ),
    })
    DATA_LIST.push(...list)
  }
  console.log('DATA_LIST', DATA_LIST)
  return await DATA_LIST
}

export const marketImportTwo = async ({
  portfolioObj,
  web3,
  Market_ADDRESS,
  ContractMarket,
  apiKey,
  apiUrl,
  collectibleAddedSourceData,
  collectibleRemovedSourceData,
  collectiblePurchasedSourceSourceData,
  payTokenOptions,
}: MarketImportTypeTwo) => {
  let constantWeb3721 = new web3.eth.Contract(MarketSharedToken_ABI, portfolioObj.contracts)
  let data721 = await constantWeb3721.methods.supportsInterface('0x80ac58cd').call()
  if (data721) {
    return await marketImportThree({
      portfolioObj,
      web3,
      Market_ADDRESS,
      ContractMarket,
      num: 721,
      contract: constantWeb3721,
      theme: portfolioObj.label,
      address: portfolioObj.contracts,
      apiKey,
      apiUrl,
      collectibleAddedSourceData,
      collectibleRemovedSourceData,
      collectiblePurchasedSourceSourceData,
      payTokenOptions,
    })
  } else return await []
}

export const marketImportThree = async ({
  portfolioObj,
  web3,
  Market_ADDRESS,
  contract,
  theme,
  ContractMarket,
  address,
  apiKey,
  apiUrl,
  collectibleAddedSourceData,
  collectibleRemovedSourceData,
  collectiblePurchasedSourceSourceData,
  payTokenOptions,
}: MarketImportTypeTwo & {
  contract: any
  theme: string
  num: number
  address: string
}) => {
  let source = await getMarketListSourceImport({
    portfolioObj,
    web3,
    Market_ADDRESS,
    contract,
    ContractMarket,
    apiKey,
    apiUrl,
    collectibleAddedSourceData,
    collectibleRemovedSourceData,
    collectiblePurchasedSourceSourceData,
    payTokenOptions,
  })
  let parseSourceData = await setParseSourceDataImport({ transferSource: source.transferSource, web3, apiKey, apiUrl })
  let collectibleTransferSourceSourceData = parseSourceData.collectibleTransferSourceSourceData

  let data = await getMarketOnSaleListAllImport({
    portfolioObj,
    web3,
    Market_ADDRESS,
    contract,
    ContractMarket,
    apiKey,
    apiUrl,
    collectibleAddedSourceData,
    collectibleRemovedSourceData,
    collectiblePurchasedSourceSourceData,
    payTokenOptions,
    collectibleTransferSourceSourceData,
    theme: portfolioObj.label,
  })
  const { onSaleData, ontSaleData } = data
  let arr = [...onSaleData, ...ontSaleData]
  arr.sort(function (a: any, b: any) {
    return b.blockNumber - a.blockNumber
  })
  arr.forEach((item) => {
    item.contracts = portfolioObj.contracts
    item.contracts_type = 721
    item.categoriesName = portfolioObj.value
  })
  return await arr
}

const getMarketOnSaleListAllImport = async ({
  portfolioObj,
  web3,
  Market_ADDRESS,
  contract,
  ContractMarket,
  apiKey,
  apiUrl,
  collectibleAddedSourceData,
  collectibleRemovedSourceData,
  collectiblePurchasedSourceSourceData,
  payTokenOptions,
  collectibleTransferSourceSourceData,
  theme,
}: MarketImportTypeTwo & {
  contract: any
  theme: string
  collectibleTransferSourceSourceData: any[]
}) => {
  let onSaleData = await getMarketOnSaleListImport({
    portfolioObj,
    web3,
    Market_ADDRESS,
    contract,
    ContractMarket,
    apiKey,
    apiUrl,
    collectibleAddedSourceData,
    collectibleRemovedSourceData,
    collectiblePurchasedSourceSourceData,
    payTokenOptions,
    collectibleTransferSourceSourceData,
    theme,
  })

  let ontSaleData: CardType[] = []
  let transferCreateData: any[] = []
  let transferRemoveData: any[] = []
  let transferSourceDataArr: any[] = []

  collectibleTransferSourceSourceData.forEach((element: any, index: number) => {
    if (element.from === '0x0000000000000000000000000000000000000000') transferCreateData.push({ tokenId: element.tokenId })
    else if (element.to === '0x0000000000000000000000000000000000000000') transferRemoveData.push({ tokenId: element.tokenId })
    transferSourceDataArr.push(element)
  })
  let arr: any[] = transferCreateData.filter((item) => !transferRemoveData.some((ele) => ele.tokenId === item.tokenId))
  let arr2: any[] = objArrayDuplicateRemoval(
    transferSourceDataArr.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  let allArr: any[] = arr2.filter((item) => arr.some((ele) => ele.tokenId === item.tokenId))
  for (let i = 0; i < allArr.length; i++) {
    let item = arr2[i]
    let isStatusOne = onSaleData.filter((ite: any) => ite.tokenId === item.tokenId)
    if (isStatusOne.length === 0) {
      let uri = await contract.methods.tokenURI(item.tokenId).call()
      const axiosData: any = await (await GetIPFSJson(uri)).axiosData
      let royaltyCall: any = await contract.methods.royaltyInfo(item.tokenId, web3.utils.toWei('1')).call()
      let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
      let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
      let time = await blockToTimestamp(web3, item.blockNumber)
      let obj: CardType = {
        tokenId: item.tokenId,
        name: axiosData.name || `${theme} #${item.tokenId}`,
        image: axiosData.image || DEFAULT_IMG,
        cover: axiosData.image || DEFAULT_IMG,
        index: item.index,
        serialNumber: `importmarket${item.tokenId.toString()}`,
        status: '2',
        isSell: false,
        blockNumber: item.blockNumber,
        nameTheme: theme,
        categoriesName: axiosData.categoriesName,
        price: '0',
        address: item.to,
        collection: Market_ADDRESS,
        description: axiosData.description,
        royalty,
        time,
        royaltyAddress: royaltyCall[0],
        isImport: true,
      }
      ontSaleData.push(obj)
    }
  }
  return {
    onSaleData,
    ontSaleData,
  }
}

const getMarketOnSaleListImport = async ({
  collectibleAddedSourceData,
  collectibleTransferSourceSourceData,
  collectibleRemovedSourceData,
  Market_ADDRESS,
  contract,
  web3,
  theme,
  payTokenOptions,
}: MarketImportTypeTwo & {
  contract: any
  theme: string
  collectibleTransferSourceSourceData: any[]
}) => {
  let collectibleAddedData: any[] = collectibleAddedSourceData
  let collectibleRemovedData: any[] = collectibleRemovedSourceData
  let transferSourceDataArr: any[] = collectibleTransferSourceSourceData.filter(
    (item) => item.from !== '0x0000000000000000000000000000000000000000' && item.to !== '0x0000000000000000000000000000000000000000',
  )
  let added: any[] = objArrayDuplicateRemoval(
    collectibleAddedData.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  let removed: any[] = objArrayDuplicateRemoval(
    collectibleRemovedData.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  let arr: any[] = added.filter((item) => !removed.some((ele) => ele.collectibleHash === item.collectibleHash))

  let arr2: any[] = objArrayDuplicateRemoval(
    transferSourceDataArr.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  let DATA_LIST: CardType[] = []
  let marketOwnedTokens = await getOwendTokendsMarketData(arr, arr2, Market_ADDRESS)
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    let isStatusOne = marketOwnedTokens.filter((ite: any) => ite === item.tokenId)
    if (isStatusOne.length === 0) continue
    let uri = await contract.methods.tokenURI(item.tokenId).call()
    const axiosData: any = await (await GetIPFSJson(uri)).axiosData
    let royaltyCall: any = await contract.methods.royaltyInfo(item.tokenId, item.price).call()
    let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(item.price).toFixed(6)
    let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
    let time = await blockToTimestamp(web3, item.blockNumber)
    let obj: CardType = {
      tokenId: item.tokenId,
      name: axiosData.name || `${theme} #${item.tokenId}`,
      image: axiosData.image || DEFAULT_IMG,
      cover: axiosData.image || DEFAULT_IMG,
      index: item.index,
      serialNumber: `importmarket${item.tokenId.toString()}`,
      status: '2',
      isSell: true,
      isSelfBuilt: false,
      blockNumber: item.blockNumber,
      nameTheme: theme,
      categoriesName: axiosData.categoriesName,
      price: item.price,
      address: item.seller,
      collection: item.collection,
      unit: payTokenOptions.find((pi) => pi.value === item.currency).label,
      collectibleHash: item.collectibleHash,
      description: axiosData.description,
      royalty,
      time,
      royaltyAddress: royaltyCall[0],
      isImport: true,
    }
    DATA_LIST.push(obj)
  }
  return DATA_LIST
}

const getMarketListSourceImport = async ({
  apiKey,
  apiUrl,
  portfolioObj,
  contract,
  web3,
}: MarketImportTypeTwo & {
  contract: any
}) => {
  try {
    if (apiKey === '' && apiUrl === '') {
      let transferSource: any = await readGetPastEvents(contract, 'Transfer')
      return await {
        transferSource: transferSource.data,
      }
    } else {
      let topic0Transfer = await web3.utils.sha3('Transfer(address,address,uint256)')
      let arrRequest: ArrRequestType[] = [{ address: portfolioObj.contracts, apiKey, apiUrl, topic0: topic0Transfer, eventNme: 'Transfer' }]
      let arrPromis: any[] = await Promise.all([readGetApiEvents(arrRequest[0])])

      return await {
        transferSource: arrPromis[0].result,
      }
    }
  } catch (error) {
    console.log('error', error)
    return await {
      transferSource: [],
    }
  }
}

const setParseSourceDataImport = async ({
  transferSource,
  apiUrl,
  apiKey,
  web3,
}: {
  transferSource: any[]
  apiUrl: string
  apiKey: string
  web3: Web3
}) => {
  let collectibleTransferSourceSourceData: any[] = []
  try {
    if (apiUrl === '' && apiKey === '') {
      transferSource.forEach((element: any, index: number) => {
        collectibleTransferSourceSourceData.push({
          index,
          blockNumber: element.blockNumber,
          from: element.returnValues.from,
          to: element.returnValues.to,
          tokenId: element.returnValues.tokenId,
        })
      })

      return await {
        collectibleTransferSourceSourceData,
      }
    } else {
      for (let i = 0; i < transferSource.length; i++) {
        let element = transferSource[i]
        let tokenId = web3.utils.hexToNumber(element.topics[3])
        let blockNumber: any = web3.utils.hexToNumber(element.blockNumber)
        let data: any = {
          from: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
          to: `0x${element.topics[2].substring(26, element.topics[2].length)}`,
          tokenId: tokenId.toString(),
        }
        collectibleTransferSourceSourceData.push({
          ...data,
          index: i,
          blockNumber,
        })
      }

      return await {
        collectibleTransferSourceSourceData,
      }
    }
  } catch (error) {
    console.log('error', error)
    return await {
      collectibleTransferSourceSourceData,
    }
  }
}
