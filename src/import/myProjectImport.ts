import Web3 from 'web3'
import { CardType, ArrRequestType } from '@/common/data'
import { MarketSharedToken_ABI } from '@/contracts/constant'
import { readGetApiEvents, GetIPFSJson, blockToTimestamp, readGetPastEvents } from '@/common'
import BigNumber from 'bignumber.js'
import { objArrayDuplicateRemoval } from '@/utils'
import DEFAULT_IMG from '@/assets/default.png'
import type { PortfolioType } from '@/hooks/useCreateHooks'
import { getOwendTokendsMarketData, getOwendTokendsMyNftData } from '@/import/owendTokens'

export interface MyProjectImportType {
  Market_ADDRESS: string
  payTokenOptions: any[]
  portfolioObj: PortfolioType
  myAddress: string
  web3: Web3
  CollectibleAdded: any[]
  CollectibleRemoved: any[]
  apiKey: string
  apiUrl: string
}

export const myProjectImport = async ({
  Market_ADDRESS,
  payTokenOptions,
  portfolioObj,
  myAddress,
  web3,
  CollectibleAdded,
  CollectibleRemoved,
  apiKey,
  apiUrl,
}: MyProjectImportType) => {
  let contract = new web3.eth.Contract(MarketSharedToken_ABI, portfolioObj.contracts)
  let data721 = await contract.methods.supportsInterface('0x80ac58cd').call()
  if (data721) {
    return await myProjectImportTwo({
      Market_ADDRESS,
      payTokenOptions,
      portfolioObj,
      myAddress,
      web3,
      CollectibleAdded,
      CollectibleRemoved,
      contract,
      address: portfolioObj.contracts,
      apiKey,
      apiUrl,
    })
  } else return await []
}

export const myProjectImportTwo = async ({
  Market_ADDRESS,
  payTokenOptions,
  portfolioObj,
  myAddress,
  web3,
  CollectibleAdded,
  CollectibleRemoved,
  contract,
  address,
  apiKey,
  apiUrl,
}: MyProjectImportType & {
  contract: any
  address: string
}) => {
  let source = await getProjectListSourceImport({
    Market_ADDRESS,
    payTokenOptions,
    portfolioObj,
    myAddress,
    web3,
    CollectibleAdded,
    CollectibleRemoved,
    contract,
    apiKey,
    apiUrl,
  })
  let parseSourceData = await setParseSourceDataImport({ transferSource: source.transferSource, web3, apiKey, apiUrl })
  const transferData = await transferDataList({
    Market_ADDRESS,
    payTokenOptions,
    portfolioObj,
    myAddress,
    web3,
    CollectibleAdded,
    CollectibleRemoved,
    contract,
    apiKey,
    apiUrl,
    theme: portfolioObj.label,
    transferSourceData: parseSourceData.collectibleTransferSourceSourceData,
  })
  const myOnSaleData: any = await myOnSaleListImport({
    Market_ADDRESS,
    payTokenOptions,
    portfolioObj,
    myAddress,
    web3,
    CollectibleAdded,
    CollectibleRemoved,
    contract,
    apiKey,
    apiUrl,
    transferSourceData: parseSourceData.collectibleTransferSourceSourceData,
    theme: portfolioObj.label,
  })

  let listData = [...myOnSaleData, ...transferData]
  listData.forEach((item) => {
    item.contracts = portfolioObj.contracts
    item.contracts_type = 721
    item.categoriesName = portfolioObj.value
  })
  return objArrayDuplicateRemoval(
    listData.sort(function (a: any, b: any) {
      return b.blockNumber - a.blockNumber
    }),
  )
}

const getProjectListSourceImport = async ({
  apiKey,
  apiUrl,
  portfolioObj,
  contract,
  web3,
}: MyProjectImportType & {
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

const transferDataList = async ({
  transferSourceData,
  myAddress,
  Market_ADDRESS,
  contract,
  web3,
  theme,
}: MyProjectImportType & {
  contract: any
  transferSourceData: any[]
  theme: string
}) => {
  try {
    let transferMyNftData: any[] = transferSourceData.filter(
      (item) => item.from.toLowerCase() === myAddress.toLowerCase() || item.to.toLowerCase() === myAddress.toLowerCase(),
    )
    let transferMyNftDataFilter: any[] = objArrayDuplicateRemoval(
      transferMyNftData.sort(function (a: any, b: any) {
        return b.blockNumber - a.blockNumber
      }),
    )
    let myTransferSource = await getOwendTokendsMyNftData(transferMyNftDataFilter, myAddress, Market_ADDRESS)
    let transferData: CardType[] = []
    for (let i = 0; i < transferSourceData.length; i++) {
      let item = transferSourceData[i]
      if (item.from === '0x0000000000000000000000000000000000000000' || item.from.toLowerCase() === Market_ADDRESS.toLowerCase()) {
        let isStatusOne = myTransferSource.filter((ite: any) => ite === item.tokenId)
        if (isStatusOne.length === 0) continue
        let uri = await contract.methods.tokenURI(item.tokenId).call()
        const axiosData: any = await (await GetIPFSJson(uri)).axiosData
        let royaltyCall: any = await contract.methods.royaltyInfo(item.tokenId, web3.utils.toWei('1')).call()
        let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
        let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
        let time = await blockToTimestamp(web3, item.blockNumber)
        transferData.push({
          tokenId: item.tokenId,
          index: i,
          serialNumber: `createimport${item.tokenId.toString()}`,
          address: item.to,
          isSelfBuilt: false,
          name: axiosData.name || `${theme} #${item.tokenId}`,
          image: axiosData.image || DEFAULT_IMG,
          cover: axiosData.image || DEFAULT_IMG,
          description: axiosData.description,
          categoriesName: axiosData.categoriesName,
          status: '1',
          price: '0',
          royalty,
          time,
          royaltyAddress: royaltyCall[0],
          isImport: true,
        })
      }
    }
    return await transferData
  } catch (error) {
    console.log('err', error)
    return await []
  }
}

export const myOnSaleListImport = async ({
  transferSourceData,
  CollectibleAdded,
  CollectibleRemoved,
  Market_ADDRESS,
  myAddress,
  contract,
  web3,
  payTokenOptions,
  theme,
}: MyProjectImportType & {
  transferSourceData: any[]
  contract: any
  theme: string
}) => {
  try {
    let collectibleAddedData: any[] = CollectibleAdded
    let collectibleRemovedData: any[] = CollectibleRemoved
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

    let transferSourceDataArr: any[] = transferSourceData.filter(
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
        serialNumber: `onsaleimport${item.tokenId.toString()}`,
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
        royalty,
        time,
        royaltyAddress: royaltyCall[0],
        isImport: true,
      }
      DATA_LIST.push(obj)
    }
    return await DATA_LIST
  } catch (error) {
    console.log('error', error)
    return await []
  }
}
