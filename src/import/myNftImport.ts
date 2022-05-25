import Web3 from 'web3'
import { MarketSharedToken_ABI } from '@/contracts/constant'
import type { PortfolioImportType } from '@/hooks/useMyNftHooks'
import { readGetApiEvents, GetIPFSJson, blockToTimestamp, readGetPastEvents } from '@/common'
import { objArrayDuplicateRemoval } from '@/utils'
import type { CardType, ArrRequestType } from '@/common/data.d'
import BigNumber from 'bignumber.js'
import DEFAULT_IMG from '@/assets/default.png'
import { getOwendTokendsMarketData, getOwendTokendsMyNftData } from '@/import/owendTokens'

export interface MyNFTImportType {
  web3: Web3
  portfolioListImport: PortfolioImportType[]
  myAddress: string
  Market_ADDRESS: string
  SharedToken_ADDRESS: string
  ContractMarket: any
  apiKey: string
  apiUrl: string
  collectibleAddedSourceData: any[]
  collectibleRemovedSourceData: any[]
  collectiblePurchasedSourceSourceData: any[]
  payTokenOptions: any[]
}

export interface MyNFTImportTypeTwo {
  web3: Web3
  portfolioObj: PortfolioImportType
  myAddress: string
  Market_ADDRESS: string
  SharedToken_ADDRESS: string
  ContractMarket: any
  apiKey: string
  apiUrl: string
  collectibleAddedSourceData: any[]
  collectibleRemovedSourceData: any[]
  collectiblePurchasedSourceSourceData: any[]
  payTokenOptions: any[]
}

export const myNftImport = async ({
  web3,
  portfolioListImport,
  Market_ADDRESS,
  SharedToken_ADDRESS,
  myAddress,
  ContractMarket,
  apiKey,
  apiUrl,
  collectibleAddedSourceData,
  collectibleRemovedSourceData,
  collectiblePurchasedSourceSourceData,
  payTokenOptions,
}: MyNFTImportType) => {
  let DATA_LIST: any[] = []
  for (let i = 0; i < portfolioListImport.length; i++) {
    let item = portfolioListImport[i]
    let list = await myNftImportTwo({
      portfolioObj: item,
      web3,
      Market_ADDRESS,
      myAddress,
      ContractMarket,
      apiKey,
      apiUrl,
      SharedToken_ADDRESS,
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
  return await DATA_LIST
}

export const myNftImportTwo = async ({
  portfolioObj,
  web3,
  Market_ADDRESS,
  myAddress,
  ContractMarket,
  apiKey,
  SharedToken_ADDRESS,
  apiUrl,
  collectibleAddedSourceData,
  collectibleRemovedSourceData,
  collectiblePurchasedSourceSourceData,
  payTokenOptions,
}: MyNFTImportTypeTwo) => {
  let constantWeb3721 = new web3.eth.Contract(MarketSharedToken_ABI, portfolioObj.contracts)
  let data721 = await constantWeb3721.methods.supportsInterface('0x80ac58cd').call()
  if (data721) {
    return await myNftImportThree({
      portfolioObj,
      web3,
      Market_ADDRESS,
      myAddress,
      ContractMarket,
      num: 721,
      contract: constantWeb3721,
      theme: portfolioObj.label,
      SharedToken_ADDRESS,
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

export const myNftImportThree = async ({
  portfolioObj,
  web3,
  Market_ADDRESS,
  myAddress,
  contract,
  theme,
  ContractMarket,
  address,
  apiKey,
  apiUrl,
  collectibleAddedSourceData,
  collectibleRemovedSourceData,
  collectiblePurchasedSourceSourceData,
  SharedToken_ADDRESS,
  payTokenOptions,
}: MyNFTImportTypeTwo & {
  contract: any
  theme: string
  num: number
  address: string
}) => {
  let source = await getMyNftListSourceImport({
    portfolioObj,
    web3,
    Market_ADDRESS,
    myAddress,
    contract,
    SharedToken_ADDRESS,
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
  let purchaseOfList: any = await myPurchaseOfListImport({
    portfolioObj,
    web3,
    Market_ADDRESS,
    myAddress,
    contract,
    ContractMarket,
    SharedToken_ADDRESS,
    apiKey,
    apiUrl,
    collectibleAddedSourceData,
    collectibleRemovedSourceData,
    collectiblePurchasedSourceSourceData,
    collectibleTransferSourceSourceData,
    theme: portfolioObj.label,
    payTokenOptions,
    address,
  })

  let saleOfList: any = await mySaleOfListImport({
    portfolioObj,
    web3,
    Market_ADDRESS,
    myAddress,
    contract,
    ContractMarket,
    SharedToken_ADDRESS,
    apiKey,
    apiUrl,
    collectibleAddedSourceData,
    collectibleRemovedSourceData,
    collectiblePurchasedSourceSourceData,
    collectibleTransferSourceSourceData,
    theme: portfolioObj.label,
    payTokenOptions,
  })
  console.log('purchaseOfList', purchaseOfList)
  console.log('saleOfList', saleOfList)
  let DATA_LIST: CardType[] = [...purchaseOfList, ...saleOfList]
  DATA_LIST.sort(function (a: any, b: any) {
    return b.blockNumber - a.blockNumber
  })
  DATA_LIST.forEach((item) => {
    item.contracts = portfolioObj.contracts
    item.contracts_type = 721
    item.categoriesName = portfolioObj.value
  })
  return await DATA_LIST
}

const mySaleOfListImport = async ({
  collectibleAddedSourceData,
  collectibleTransferSourceSourceData,
  collectibleRemovedSourceData,
  myAddress,
  Market_ADDRESS,
  contract,
  web3,
  theme,
  payTokenOptions,
}: MyNFTImportTypeTwo & {
  contract: any
  theme: string
  collectibleTransferSourceSourceData: any[]
}) => {
  let collectibleAddedData: any[] = collectibleAddedSourceData
  let collectibleRemovedData: any[] = collectibleRemovedSourceData
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
  let arr: any[] = added.filter((item) => !removed.some((ele) => ele.collectibleHash.toLowerCase() === item.collectibleHash.toLowerCase()))

  let transferSourceDataArr: any[] = collectibleTransferSourceSourceData.filter(
    (item) => item.from !== '0x0000000000000000000000000000000000000000' && item.to !== '0x0000000000000000000000000000000000000000',
  )
  let arr2: any[] = objArrayDuplicateRemoval(
    transferSourceDataArr.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  let marketOwnedTokens = await getOwendTokendsMarketData(arr, arr2, Market_ADDRESS)
  let DATA_LIST: CardType[] = []
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    if (item.seller.toLowerCase() !== myAddress.toLowerCase()) continue
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
      index: i,
      serialNumber: `importonsale${item.tokenId.toString()}`,
      address: item.seller,
      isSelfBuilt: false,
      name: axiosData.name || `${theme} #${item.tokenId}`,
      image: axiosData.image || DEFAULT_IMG,
      cover: axiosData.image || DEFAULT_IMG,
      description: axiosData.description,
      categoriesName: axiosData.categoriesName,
      status: '2',
      price: item.price,
      collectibleHash: item.collectibleHash,
      unit: payTokenOptions.find((pi) => pi.value === item.currency).label,
      nameTheme: theme,
      royalty,
      time,
      royaltyAddress: royaltyCall[0],
      isImport: true,
    }
    DATA_LIST.push(obj)
  }
  return DATA_LIST
}

const myPurchaseOfListImport = async ({
  collectibleTransferSourceSourceData,
  collectiblePurchasedSourceSourceData,
  myAddress,
  Market_ADDRESS,
  SharedToken_ADDRESS,
  contract,
  web3,
  theme,
  address,
}: MyNFTImportTypeTwo & {
  contract: any
  theme: string
  address: string
  collectibleTransferSourceSourceData: any[]
}) => {
  let transferMyNftData: any[] = collectibleTransferSourceSourceData.filter(
    (item) => item.from.toLowerCase() === myAddress.toLowerCase() || item.to.toLowerCase() === myAddress.toLowerCase(),
  )
  let transferMyNftDataFilter: any[] = objArrayDuplicateRemoval(
    transferMyNftData.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  let myTransferSource = await getOwendTokendsMyNftData(transferMyNftDataFilter, myAddress, Market_ADDRESS)
  let transferData: CardType[] = []
  for (let i = 0; i < collectibleTransferSourceSourceData.length; i++) {
    let element = collectibleTransferSourceSourceData[i]
    if (element.from === '0x0000000000000000000000000000000000000000' && element.to.toLowerCase() === myAddress.toLowerCase()) {
      let isStatusOne = myTransferSource.filter((ite: any) => ite === element.tokenId)
      if (isStatusOne.length === 0) continue
      let uri = await contract.methods.tokenURI(element.tokenId).call()
      const axiosData: any = await (await GetIPFSJson(uri)).axiosData
      let royaltyCall: any = await contract.methods.royaltyInfo(element.tokenId, web3.utils.toWei('1')).call()
      let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
      let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
      let time = await blockToTimestamp(web3, element.blockNumber)
      transferData.push({
        tokenId: element.tokenId,
        index: i,
        serialNumber: `importcreate${element.tokenId.toString()}`,
        address: element.to,
        isSelfBuilt: false,
        name: axiosData.name || `${theme} #${element.tokenId}`,
        image: axiosData.image || DEFAULT_IMG,
        cover: axiosData.image || DEFAULT_IMG,
        description: axiosData.description,
        categoriesName: axiosData.categoriesName,
        status: '0',
        nameTheme: theme,
        blockNumber: element.blockNumber,
        price: '0',
        royalty,
        time,
        royaltyAddress: royaltyCall[0],
        isImport: true,
      })
    }
  }

  let purchasedData: CardType[] = []
  for (let i = 0; i < collectiblePurchasedSourceSourceData.length; i++) {
    let element = collectiblePurchasedSourceSourceData[i]
    if (element.collection.toLowerCase() !== address.toLowerCase()) continue
    if (element.purchaser.toLowerCase() === myAddress.toLowerCase()) {
      let isStatusOne = myTransferSource.filter((ite: any) => ite === element.tokenId)
      if (isStatusOne.length === 0) continue
      let uri = await contract.methods.tokenURI(element.tokenId).call()
      const axiosData: any = await (await GetIPFSJson(uri)).axiosData
      let royaltyCall: any = await contract.methods.royaltyInfo(element.tokenId, web3.utils.toWei('1')).call()
      let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
      let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
      let time = await blockToTimestamp(web3, element.blockNumber)
      purchasedData.push({
        tokenId: element.tokenId,
        index: i,
        serialNumber: `importcreate${element.tokenId.toString()}`,
        address: element.purchaser,
        isSelfBuilt: false,
        name: axiosData.name || `${theme} #${element.tokenId}`,
        image: axiosData.image || DEFAULT_IMG,
        cover: axiosData.image || DEFAULT_IMG,
        description: axiosData.description,
        categoriesName: axiosData.categoriesName,
        status: '1',
        nameTheme: theme,
        blockNumber: element.blockNumber,
        price: '0',
        royalty,
        time,
        royaltyAddress: royaltyCall[0],
        isImport: true,
      })
    }
  }
  let arr = [...purchasedData, ...transferData]
  let DATA_LIST: CardType[] = objArrayDuplicateRemoval(
    arr.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
  return DATA_LIST
}

const getMyNftListSourceImport = async ({
  apiKey,
  apiUrl,
  portfolioObj,
  contract,
  web3,
}: MyNFTImportTypeTwo & {
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
    return {
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
