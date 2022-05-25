import { useEffect, useState } from 'react'
import type { CardType, ArrRequestType } from '@/common/data.d'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { readGetPastEvents, getIpfsHashFromBytes32, readGetApiEvents, GetWeb3StorageJsonTwo, blockToTimestamp } from '@/common'
import { objArrayDuplicateRemoval } from '@/utils'
import BigNumber from 'bignumber.js'
import useWeb3StoreHooks from '@/hooks/useWeb3StoreHooks'
import type { StorageClientTypes } from '@/contracts/web3StorageInit'
import { retrieveFiles } from '@/contracts/web3StorageFun'
import { useSelector } from 'react-redux'
import { GetWeb3StorageJsonOne } from '@/common'
import { myNftImport } from '@/import/myNftImport'
import { Default_data_arr, Default_data_theme_arr } from '@/common/init'
import { getOwendTokendsMarketData, getOwendTokendsMyNftData } from '@/import/owendTokens'
import CID from 'cids'

interface Type {
  myAddress: string
  isRefreshData: boolean
}

export interface PortfolioImportType {
  key?: string | number
  label: string
  value: string
  blockNumber: number
  cover: string
  coverFiles: string
  isImport: boolean
  contracts: any
}

interface DataAddType {
  name: string
  blockNumber: number
  account: string
  collectionHash: string
  colletion: string
}

interface DataRmoveType {
  collectionHash: string
  blockNumber: number
  account: string
}

export const useMyNftHooks = (props: Type) => {
  const nftData: ConstantInitTypes = useDataHooks()
  const { constant, payTokenOptions, Market_ADDRESS, web3, apiKey, apiUrl, SharedToken_ADDRESS, Categories_ADDRESS } = nftData
  const { myAddress, isRefreshData } = props

  const web3Store: StorageClientTypes = useWeb3StoreHooks()
  const { client } = web3Store
  const { web3StorageList } = useSelector((state: any) => state.infoInfo)

  const [myNftList, setMyNftList] = useState<CardType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (myAddress) {
      setMyNftList([])
      getMyNftList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myAddress, isRefreshData, apiKey, apiUrl])

  const getMyNftList = async () => {
    try {
      let source = await getMyNftListSource()
      let parseSourceData = await setParseSourceData(source)
      let purchaseOfList: any = await myPurchaseOfList({
        collectiblePurchasedSourceSourceData: parseSourceData.collectiblePurchasedSourceSourceData,
        collectibleTransferSourceSourceData: parseSourceData.collectibleTransferSourceSourceData,
      })
      let saleOfList: any = await mySaleOfList({
        collectibleAddedSourceData: parseSourceData.collectibleAddedSourceData,
        collectibleRemovedSourceData: parseSourceData.collectibleRemovedSourceData,
        collectibleTransferSourceSourceData: parseSourceData.collectibleTransferSourceSourceData,
      })
      console.log('purchaseOfList', purchaseOfList)
      console.log('saleOfList', saleOfList)
      let DATA_LIST: CardType[] = [...purchaseOfList, ...saleOfList]
      DATA_LIST.sort(function (a: any, b: any) {
        return b.blockNumber - a.blockNumber
      })
      let portfolioList = await getPortfolioImportList()
      let portfolioListImport = portfolioList.filter((item) => item.isImport === true)
      let portfolioListImportNew = portfolioListImport.filter((currentValue, currentIndex, selfArr) => {
        return selfArr.findIndex((x: any) => x.contracts === currentValue.contracts) === currentIndex
      })
      console.log('portfolioListImportNew', portfolioListImportNew)
      if (portfolioListImportNew.length > 0) {
        let DATA_LIST_IMPORT = await myNftImport({
          web3,
          portfolioListImport: portfolioListImportNew,
          Market_ADDRESS,
          myAddress,
          ContractMarket: constant.ContractMarket,
          apiKey,
          apiUrl,
          payTokenOptions,
          SharedToken_ADDRESS,
          collectiblePurchasedSourceSourceData: parseSourceData.collectiblePurchasedSourceSourceData,
          collectibleAddedSourceData: parseSourceData.collectibleAddedSourceData,
          collectibleRemovedSourceData: parseSourceData.collectibleRemovedSourceData,
        })
        console.log('DATA_LIST', DATA_LIST)
        console.log('DATA_LIST_IMPORT', DATA_LIST_IMPORT)
        let arr = [...DATA_LIST, ...DATA_LIST_IMPORT]
        setMyNftList(
          arr.sort(function (a: any, b: any) {
            return b.blockNumber - a.blockNumber
          }),
        )
        setLoading(false)
      } else {
        let arr = [...DATA_LIST]
        console.log('arr', arr)
        setMyNftList(
          arr.sort(function (a: any, b: any) {
            return b.blockNumber - a.blockNumber
          }),
        )
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log('error', error)
    }
  }

  const getMyNftListSource = async () => {
    try {
      if (apiKey === '' && apiUrl === '') {
        let collectibleAddedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleAdded')
        let collectibleRemovedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleRemoved')
        let transferSource: any = await readGetPastEvents(constant.ContractMarketSharedToken, 'Transfer')
        let purchasedSource: any = await readGetPastEvents(constant.ContractMarket, 'Purchased')

        return await {
          transferSource: transferSource.data,
          collectibleAddedSource: collectibleAddedSource.data,
          collectibleRemovedSource: collectibleRemovedSource.data,
          purchasedSource: purchasedSource.data,
        }
      } else {
        let topic0Transfer = await web3.utils.sha3('Transfer(address,address,uint256)')
        let topic0CollectibleAdded = await web3.utils.sha3(
          'CollectibleAdded(bytes32,bytes32,address,address,uint256,uint256,address,uint256)',
        )
        let topic0CollectibleRemoved = await web3.utils.sha3('CollectibleRemoved(bytes32,address,uint256,uint256)')
        let topic0Purchased = await web3.utils.sha3('Purchased(bytes32,address,address,uint256,uint256)')
        let arrRequest: ArrRequestType[] = [
          { address: SharedToken_ADDRESS, apiKey, apiUrl, topic0: topic0Transfer, eventNme: 'Transfer' },
          { address: Market_ADDRESS, apiKey, apiUrl, topic0: topic0CollectibleAdded, eventNme: 'CollectibleAdded' },
          { address: Market_ADDRESS, apiKey, apiUrl, topic0: topic0CollectibleRemoved, eventNme: 'CollectibleRemoved' },
          { address: Market_ADDRESS, apiKey, apiUrl, topic0: topic0Purchased, eventNme: 'Purchased' },
        ]
        let arrPromis: any[] = await Promise.all([
          readGetApiEvents(arrRequest[0]),
          readGetApiEvents(arrRequest[1]),
          readGetApiEvents(arrRequest[2]),
          readGetApiEvents(arrRequest[3]),
        ])

        return await {
          transferSource: arrPromis[0].result,
          collectibleAddedSource: arrPromis[1].result,
          collectibleRemovedSource: arrPromis[2].result,
          purchasedSource: arrPromis[3].result,
        }
      }
    } catch (error) {
      console.log('error', error)
      return await {
        transferSource: [],
        collectibleAddedSource: [],
        collectibleRemovedSource: [],
        purchasedSource: [],
      }
    }
  }

  const setParseSourceData = async ({
    transferSource,
    collectibleAddedSource,
    collectibleRemovedSource,
    purchasedSource,
  }: {
    transferSource: any[]
    collectibleAddedSource: any[]
    collectibleRemovedSource: any[]
    purchasedSource: any[]
  }) => {
    let collectibleAddedSourceData: any[] = []
    let collectibleRemovedSourceData: any[] = []
    let collectibleTransferSourceSourceData: any[] = []
    let collectiblePurchasedSourceSourceData: any[] = []
    try {
      if (apiUrl === '' && apiKey === '') {
        collectibleAddedSource.forEach((element: any, index: number) => {
          collectibleAddedSourceData.push({
            amount: element.returnValues.amount,
            category: element.returnValues.category,
            collectibleHash: element.returnValues.collectibleHash,
            collection: element.returnValues.collection,
            currency: element.returnValues.currency,
            price: element.returnValues.price,
            seller: element.returnValues.seller,
            tokenId: element.returnValues.tokenId,
            blockNumber: element.blockNumber,
            index,
          })
        })

        collectibleRemovedSource.forEach((element: any, index: number) => {
          collectibleRemovedSourceData.push({
            index,
            collectibleHash: element.returnValues.collectibleHash,
            blockNumber: element.blockNumber,
            collection: element.returnValues.collection,
          })
        })

        transferSource.forEach((element: any, index: number) => {
          collectibleTransferSourceSourceData.push({
            index,
            from: element.returnValues.from,
            to: element.returnValues.to,
            tokenId: element.returnValues.tokenId,
            blockNumber: element.blockNumber,
          })
        })

        purchasedSource.forEach((element: any, index: number) => {
          collectiblePurchasedSourceSourceData.push({
            index,
            collectibleHash: element.returnValues.collectibleHash,
            purchaser: element.returnValues.purchaser,
            collection: element.returnValues.collection,
            tokenId: element.returnValues.tokenId,
            amount: element.returnValues.amount,
            blockNumber: element.blockNumber,
          })
        })
        return await {
          collectibleAddedSourceData,
          collectibleRemovedSourceData,
          collectibleTransferSourceSourceData,
          collectiblePurchasedSourceSourceData,
        }
      } else {
        let parameterArrayCollectibleAdded = ['bytes32', 'uint256', 'uint256', 'address', 'uint256']
        let parameterArrayCollectibleRemoved = ['bytes32', 'uint256', 'uint256']
        let parameterArraypurchasedData = ['bytes32', 'uint256', 'uint256']
        collectibleAddedSource.forEach((element: any, index: number) => {
          let blockNumber = web3.utils.hexToNumber(element.blockNumber)
          let parameters = web3.eth.abi.decodeParameters(parameterArrayCollectibleAdded, element.data)
          let obj = {
            amount: parameters[2],
            category: element.topics[1],
            collectibleHash: parameters[0],
            collection: `0x${element.topics[3].substring(26, element.topics[3].length)}`,
            currency: parameters[3],
            price: parameters[4],
            seller: `0x${element.topics[2].substring(26, element.topics[2].length)}`,
            tokenId: parameters[1],
            blockNumber,
            index,
          }
          collectibleAddedSourceData.push(obj)
        })

        collectibleRemovedSource.forEach((element: any, index: number) => {
          let blockNumber = web3.utils.hexToNumber(element.blockNumber)
          let parameters = web3.eth.abi.decodeParameters(parameterArrayCollectibleRemoved, element.data)
          let obj = {
            index,
            collectibleHash: parameters[0],
            blockNumber,
            collection: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
          }
          collectibleRemovedSourceData.push(obj)
        })

        transferSource.forEach((element: any, index: number) => {
          let tokenId = web3.utils.hexToNumber(element.topics[3])
          let data: any = {
            from: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
            to: `0x${element.topics[2].substring(26, element.topics[2].length)}`,
            tokenId: tokenId.toString(),
          }
          let blockNumber = web3.utils.hexToNumber(element.blockNumber)
          collectibleTransferSourceSourceData.push({
            ...data,
            index,
            blockNumber,
          })
        })

        purchasedSource.forEach((element: any, index: number) => {
          let parameters = web3.eth.abi.decodeParameters(parameterArraypurchasedData, element.data)
          let collection = `0x${element.topics[2].substring(26, element.topics[2].length)}`
          let blockNumber = web3.utils.hexToNumber(element.blockNumber)
          collectiblePurchasedSourceSourceData.push({
            index,
            collectibleHash: parameters[0],
            purchaser: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
            collection,
            tokenId: parameters[1],
            blockNumber,
            amount: parameters[2],
          })
        })
        return await {
          collectibleAddedSourceData,
          collectibleRemovedSourceData,
          collectibleTransferSourceSourceData,
          collectiblePurchasedSourceSourceData,
        }
      }
    } catch (error) {
      console.log('error', error)
      return await {
        collectibleAddedSourceData,
        collectibleRemovedSourceData,
        collectibleTransferSourceSourceData,
        collectiblePurchasedSourceSourceData,
      }
    }
  }

  const myPurchaseOfList = async ({
    collectibleTransferSourceSourceData,
    collectiblePurchasedSourceSourceData,
  }: {
    collectibleTransferSourceSourceData: any[]
    collectiblePurchasedSourceSourceData: any[]
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
        let uri = await constant.ContractMarketSharedToken.methods.tokenURI(element.tokenId).call()
        let cid = getIpfsHashFromBytes32(uri)
        let cidV1 = new CID(cid).toV1().toString('base32')
        const { axiosData, axiosDataTheme } = (await (
          await getLocal(cidV1)
        ).isAxiosTrue)
          ? await getLocal(cidV1)
          : await GetWeb3StorageJsonTwo(cidV1, retrieveFiles, client)
        let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(element.tokenId, web3.utils.toWei('1')).call()
        let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
        let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
        let time = await blockToTimestamp(web3, element.blockNumber)
        let categoriesName = await constant.ContractMarketSharedToken.methods.collectionURI(element.tokenId).call()
        let obj: any = {
          tokenId: element.tokenId,
          index: i,
          serialNumber: `create${element.tokenId.toString()}`,
          address: element.to,
          isSelfBuilt: true,
          name: axiosData.name,
          image: axiosData.imageFiles,
          cover: axiosData.coverFiles,
          description: axiosData.description,
          categoriesName,
          status: '0',
          nameTheme: axiosDataTheme.name,
          blockNumber: element.blockNumber,
          price: '0',
          royalty,
          time,
          royaltyAddress: royaltyCall[0],
        }
        if (axiosData.isDefault) obj.isDefault = axiosData.isDefault
        transferData.push(obj)
      }
    }
    let purchasedData: CardType[] = []
    for (let i = 0; i < collectiblePurchasedSourceSourceData.length; i++) {
      let element = collectiblePurchasedSourceSourceData[i]
      if (element.collection.toLowerCase() !== SharedToken_ADDRESS.toLowerCase()) continue
      if (element.purchaser.toLowerCase() === myAddress.toLowerCase()) {
        let isStatusOne = myTransferSource.filter((ite: any) => ite === element.tokenId)
        if (isStatusOne.length === 0) continue
        let uri = await constant.ContractMarketSharedToken.methods.tokenURI(element.tokenId).call()
        let cid = getIpfsHashFromBytes32(uri)
        let cidV1 = new CID(cid).toV1().toString('base32')
        const { axiosData, axiosDataTheme } = (await (
          await getLocal(cidV1)
        ).isAxiosTrue)
          ? await getLocal(cidV1)
          : await GetWeb3StorageJsonTwo(cidV1, retrieveFiles, client)
        let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(element.tokenId, web3.utils.toWei('1')).call()
        let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
        let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
        let time = await blockToTimestamp(web3, element.blockNumber)
        let categoriesName = await constant.ContractMarketSharedToken.methods.collectionURI(element.tokenId).call()
        let obj: any = {
          tokenId: element.tokenId,
          index: i,
          serialNumber: `create${element.tokenId.toString()}`,
          address: element.purchaser,
          isSelfBuilt: axiosData.myAddress === myAddress,
          name: axiosData.name,
          image: axiosData.imageFiles,
          cover: axiosData.coverFiles,
          description: axiosData.description,
          categoriesName,
          status: '1',
          nameTheme: axiosDataTheme.name,
          blockNumber: element.blockNumber,
          price: '0',
          royalty,
          time,
          royaltyAddress: royaltyCall[0],
        }
        if (axiosData.isDefault) obj.isDefault = axiosData.isDefault
        purchasedData.push(obj)
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

  const mySaleOfList = async ({
    collectibleAddedSourceData,
    collectibleRemovedSourceData,
    collectibleTransferSourceSourceData,
  }: {
    collectibleAddedSourceData: any[]
    collectibleRemovedSourceData: any[]
    collectibleTransferSourceSourceData: any[]
  }) => {
    let collectibleAddedData: any[] = collectibleAddedSourceData.filter(
      (item) => item.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase(),
    )
    let collectibleRemovedData: any[] = collectibleRemovedSourceData.filter(
      (item) => item.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase(),
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
    let arr: any[] = added.filter(
      (item) => !removed.some((ele) => ele.collectibleHash.toLowerCase() === item.collectibleHash.toLowerCase()),
    )

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
      let uri = await constant.ContractMarketSharedToken.methods.tokenURI(item.tokenId).call()
      let cid = getIpfsHashFromBytes32(uri)
      let cidV1 = new CID(cid).toV1().toString('base32')
      const { axiosData, axiosDataTheme } = (await (
        await getLocal(cidV1)
      ).isAxiosTrue)
        ? await getLocal(cidV1)
        : await GetWeb3StorageJsonTwo(cidV1, retrieveFiles, client)
      let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(item.tokenId, item.price).call()
      let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(item.price).toFixed(6)
      let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
      let time = await blockToTimestamp(web3, item.blockNumber)
      let categoriesName = await constant.ContractMarketSharedToken.methods.collectionURI(item.tokenId).call()
      let obj: CardType = {
        tokenId: item.tokenId,
        index: i,
        serialNumber: `onsale${item.tokenId.toString()}`,
        address: item.seller,
        isSelfBuilt: axiosData.myAddress === myAddress,
        name: axiosData.name,
        image: axiosData.imageFiles,
        cover: axiosData.coverFiles,
        description: axiosData.description,
        categoriesName,
        status: '2',
        price: item.price,
        collectibleHash: item.collectibleHash,
        unit: payTokenOptions.find((pi) => pi.value === item.currency).label,
        nameTheme: axiosDataTheme.name,
        royalty,
        time,
        royaltyAddress: royaltyCall[0],
      }
      if (axiosData.isDefault) obj.isDefault = axiosData.isDefault
      DATA_LIST.push(obj)
    }
    return DATA_LIST
  }

  const getLocal = async (cid: string) => {
    let web3StorageData = web3StorageList.filter((item: any) => item.cid === cid)
    let navThemeCid =
      web3StorageData && web3StorageData.length > 0 ? getIpfsHashFromBytes32((web3StorageData[0].jsonSource as any).categoriesName) : ''
    let navThemeCidV1 = navThemeCid !== '' ? new CID(navThemeCid).toV1().toString('base32') : ''
    let web3StorageDataTheme = web3StorageList.filter((item: any) => item.cid === navThemeCidV1)
    return {
      axiosData: web3StorageData.length > 0 ? web3StorageData[0].jsonSource : Default_data_arr,
      axiosDataTheme: web3StorageDataTheme && web3StorageDataTheme.length > 0 ? web3StorageDataTheme[0].jsonSource : Default_data_theme_arr,
      isAxiosTrue: web3StorageDataTheme && web3StorageDataTheme.length === 1 ? true : false,
    }
  }

  const getPortfolioImportList = async () => {
    let source = await getPortfolioImportSource()
    let parseSourceData = await setPortfolioImportParseSourceData(source)

    let addedData = parseSourceData.addedData
    let removedData = parseSourceData.removedData
    let arr1: DataAddType[] = []
    addedData.forEach((data) => {
      let filter = removedData.filter((item) => item.collectionHash.toLowerCase() === data.collectionHash.toLowerCase())
      if (filter.length === 0) arr1.push(data)
    })
    let DATA_LIST: PortfolioImportType[] = []
    for (let i = 0; i < arr1.length; i++) {
      let cid = getIpfsHashFromBytes32(arr1[i].name)
      let cidV1 = new CID(cid).toV1().toString('base32')
      let web3StorageData = web3StorageList.filter((item: any) => item.cid === cidV1)
      const axiosData =
        web3StorageData && web3StorageData.length > 0
          ? web3StorageData[0].jsonSource
          : await (
              await GetWeb3StorageJsonOne(cidV1, true)
            ).axiosData
      DATA_LIST.push({
        key: i,
        label: axiosData.isDefault ? `${axiosData.name}${i}` : axiosData.name,
        value: arr1[i].name,
        blockNumber: arr1[i].blockNumber,
        cover: axiosData.cover,
        coverFiles: axiosData.coverFiles,
        isImport: arr1[i].colletion.toLowerCase() !== SharedToken_ADDRESS.toLowerCase() ? true : false,
        contracts: arr1[i].colletion.toLowerCase(),
      })
    }
    let data_import = DATA_LIST.filter((item) => item.isImport === true)
    return await data_import
  }

  const getPortfolioImportSource = async () => {
    try {
      if (apiKey === '' && apiUrl === '') {
        let addedSource: any = await readGetPastEvents(constant.ContractCategories, 'Added')
        let removedSource: any = await readGetPastEvents(constant.ContractCategories, 'Removed')

        return await {
          addedSource: addedSource.data,
          removedSource: removedSource.data,
        }
      } else {
        let topic0Added = await web3.utils.sha3('Added(bytes32,address,address,bytes32)')
        let topic0Removed = await web3.utils.sha3('Removed(bytes32,address)')
        let arrRequest: ArrRequestType[] = [
          { address: Categories_ADDRESS, apiKey, apiUrl, topic0: topic0Added, eventNme: 'Added' },
          { address: Categories_ADDRESS, apiKey, apiUrl, topic0: topic0Removed, eventNme: 'Removed' },
        ]
        let arrPromis: any[] = await Promise.all([readGetApiEvents(arrRequest[0]), readGetApiEvents(arrRequest[1])])

        return await {
          addedSource: arrPromis[0].result,
          removedSource: arrPromis[1].result,
        }
      }
    } catch (error) {
      return await {
        addedSource: [],
        removedSource: [],
      }
    }
  }

  const setPortfolioImportParseSourceData = async ({ addedSource, removedSource }: { addedSource: any[]; removedSource: any[] }) => {
    let addedData: DataAddType[] = []
    let removedData: DataRmoveType[] = []
    try {
      if (apiUrl === '' && apiKey === '') {
        addedSource.forEach((element: any) => {
          addedData.push({
            name: element.returnValues.name,
            blockNumber: element.blockNumber,
            account: element.returnValues.account,
            collectionHash: element.returnValues.collectionHash,
            colletion: element.returnValues.colletion,
          })
        })
        removedSource.forEach((element: any) => {
          removedData.push({
            collectionHash: element.returnValues.collectionHash,
            blockNumber: element.blockNumber,
            account: element.returnValues.account,
          })
        })
        return await {
          addedData,
          removedData,
        }
      } else {
        let parameterArrayAdded = ['bytes32', 'bytes32']
        let parameterArrayRemoved = ['bytes32']
        addedSource.forEach((item: any) => {
          let parameters = web3.eth.abi.decodeParameters(parameterArrayAdded, item.data)
          let blockNumber = web3.utils.hexToNumber(item.blockNumber)
          let data: any = {
            collectionHash: parameters[0],
            name: parameters[1],
            blockNumber,
            account: `0x${item.topics[1].substring(26, item.topics[1].length)}`,
            colletion: `0x${item.topics[2].substring(26, item.topics[2].length)}`,
          }
          addedData.push(data)
        })
        removedSource.forEach((item: any) => {
          let parameters = web3.eth.abi.decodeParameters(parameterArrayRemoved, item.data)
          let blockNumber = web3.utils.hexToNumber(item.blockNumber)
          let data: any = {
            collectionHash: parameters[0],
            blockNumber,
            account: `0x${item.topics[1].substring(26, item.topics[1].length)}`,
          }
          removedData.push(data)
        })
        return await {
          addedData,
          removedData,
        }
      }
    } catch (error) {
      return await {
        addedData,
        removedData,
      }
    }
  }

  return { myNftList, loading }
}
