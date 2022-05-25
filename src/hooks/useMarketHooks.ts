import type { CardType, ArrRequestType } from '@/common/data.d'
import { useEffect, useState } from 'react'
import { objArrayDuplicateRemoval } from '@/utils'
import { readGetPastEvents, getIpfsHashFromBytes32, readGetApiEvents, GetWeb3StorageJsonTwo, blockToTimestamp } from '@/common'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import BigNumber from 'bignumber.js'
import useWeb3StoreHooks from '@/hooks/useWeb3StoreHooks'
import type { StorageClientTypes } from '@/contracts/web3StorageInit'
import { retrieveFiles } from '@/contracts/web3StorageFun'
import { useSelector } from 'react-redux'
import { getOwendTokendsMarketData } from '@/import/owendTokens'
import { GetWeb3StorageJsonOne } from '@/common'
import { marketImport } from '@/import/marketImport'
import { detailsImportApi, detailsImport } from '@/import/detailsImport'
import { Default_data_arr, Default_data_theme_arr } from '@/common/init'
import CID from 'cids'

interface Type {
  isRefreshData: boolean
  currentDetails: CardType
  myAddress: string
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

export const useMarketHooks = (props: Type) => {
  const { isRefreshData, currentDetails, myAddress } = props

  const nftData: ConstantInitTypes = useDataHooks()
  const {
    constant,
    payTokenOptions,
    Market_ADDRESS,
    web3,
    toWeiFromMwei,
    toWeiFromWei,
    Categories_ADDRESS,
    apiKey,
    apiUrl,
    SharedToken_ADDRESS,
  } = nftData

  const web3Store: StorageClientTypes = useWeb3StoreHooks()
  const { client } = web3Store

  const { web3StorageList } = useSelector((state: any) => state.infoInfo)

  const [tradList, setTradList] = useState<CardType[]>([])
  const [openBoxList, setOpenBoxList] = useState<OpenBoxType[]>([])
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTradList([])
    getTradMarketList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshData, apiKey, apiUrl, myAddress])

  useEffect(() => {
    setDetailsLoading(true)
    setOpenBoxList([])
    if (currentDetails.tokenId !== '') getOpenBoxList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDetails, apiKey, apiUrl, myAddress])

  const getTradMarketList = async () => {
    try {
      let source = await getMarketListSource()
      let parseSourceData = await setParseSourceData(source)

      let data = await getMarketOnSaleListAll({
        collectibleAddedSource: parseSourceData.collectibleAddedSourceData,
        collectibleRemovedSource: parseSourceData.collectibleRemovedSourceData,
        transferSource: parseSourceData.collectibleTransferSourceSourceData,
      })
      const { onSaleData, ontSaleData } = data
      let arr = [...onSaleData, ...ontSaleData]
      arr.sort(function (a: any, b: any) {
        return b.blockNumber - a.blockNumber
      })
      let portfolioList = await getPortfolioImportList()
      let portfolioListImport = portfolioList.filter((item) => item.isImport === true)
      let portfolioListImportNew = portfolioListImport.filter((currentValue, currentIndex, selfArr) => {
        return selfArr.findIndex((x: any) => x.contracts === currentValue.contracts) === currentIndex
      })
      console.log('portfolioListImportNew', portfolioListImportNew)
      if (portfolioListImportNew.length > 0) {
        let DATA_LIST_IMPORT = await marketImport({
          web3,
          portfolioListImport: portfolioListImportNew,
          Market_ADDRESS,
          ContractMarket: constant.ContractMarket,
          apiKey,
          apiUrl,
          payTokenOptions,
          collectiblePurchasedSourceSourceData: parseSourceData.collectiblePurchasedSourceSourceData,
          collectibleAddedSourceData: parseSourceData.collectibleAddedSourceData,
          collectibleRemovedSourceData: parseSourceData.collectibleRemovedSourceData,
        })
        let arr1 = [...arr, ...DATA_LIST_IMPORT]
        console.log('arr1_2', arr1)
        setTradList(
          arr1.sort(function (a: any, b: any) {
            return b.blockNumber - a.blockNumber
          }),
        )
        setLoading(false)
      } else {
        let arr1 = [...arr]
        console.log('arr1_1', arr1)
        setTradList(
          arr1.sort(function (a: any, b: any) {
            return b.blockNumber - a.blockNumber
          }),
        )
        setLoading(false)
      }
    } catch (error) {
      console.log('err', error)
      setLoading(false)
    }
  }

  const getOpenBoxList = async () => {
    try {
      let source = await getMarketListSource()
      let parseSourceData = await setParseSourceData(source)

      let collectibleAddedData: any[] = parseSourceData.collectibleAddedSourceData.filter(
        (item) => item.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase(),
      )
      let collectibleRemovedData: any[] = parseSourceData.collectibleRemovedSourceData.filter(
        (item) => item.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase(),
      )
      let purchasedData: any[] = parseSourceData.collectiblePurchasedSourceSourceData.filter(
        (item) => item.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase(),
      )

      let collectibleAddedDataImport: any[] = parseSourceData.collectibleAddedSourceData.filter(
        (item) => item.collection.toLowerCase() !== SharedToken_ADDRESS.toLowerCase(),
      )
      let collectibleRemovedDataImport: any[] = parseSourceData.collectibleRemovedSourceData.filter(
        (item) => item.collection.toLowerCase() !== SharedToken_ADDRESS.toLowerCase(),
      )
      let purchasedDataImport: any[] = parseSourceData.collectiblePurchasedSourceSourceData.filter(
        (item) => item.collection.toLowerCase() !== SharedToken_ADDRESS.toLowerCase(),
      )

      let transferMyCreateData: any[] = []
      let transferSourceDataArr: any[] = []

      if (!currentDetails.isImport) {
        for (let i = 0; i < parseSourceData.collectibleTransferSourceSourceData.length; i++) {
          let element = parseSourceData.collectibleTransferSourceSourceData[i]
          if (element.from === '0x0000000000000000000000000000000000000000' && element.tokenId === currentDetails.tokenId) {
            let time = await blockToTimestamp(web3, element.blockNumber.toString())
            let obj = {
              index: '-1',
              blockNumber: element.blockNumber,
              price: '-',
              from: element.from,
              to: element.to,
              time,
              unit: '',
            }
            transferMyCreateData.push(obj)
          } else {
            if (
              element.from === '0x0000000000000000000000000000000000000000' ||
              element.to === '0x0000000000000000000000000000000000000000'
            ) {
            } else transferSourceDataArr.push(element)
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
        let DATA_LIST: any[] = []
        for (let i = 0; i < allSaleSuccessList.length; i++) {
          let item = allSaleSuccessList[i]
          if (item.tokenId === currentDetails.tokenId) {
            if (DATA_LIST.length >= 10) continue
            let currentPurchaseInfo = purchasedData.find((pi) => pi.collectibleHash === item.collectibleHash)
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
        setOpenBoxList(DATA_LIST)
        setDetailsLoading(false)
      } else {
        let DATA_LIST =
          apiKey !== '' && apiUrl !== ''
            ? await detailsImportApi({
                Market_ADDRESS,
                payTokenOptions,
                toWeiFromWei,
                toWeiFromMwei,
                currentDetails,
                apiKey,
                apiUrl,
                web3,
                collectibleAddedData: collectibleAddedDataImport,
                collectibleRemovedData: collectibleRemovedDataImport,
                purchasedData: purchasedDataImport,
              })
            : await detailsImport({
                Market_ADDRESS,
                payTokenOptions,
                toWeiFromWei,
                toWeiFromMwei,
                currentDetails,
                web3,
                collectibleAddedData: collectibleAddedDataImport,
                collectibleRemovedData: collectibleRemovedDataImport,
                purchasedData: purchasedDataImport,
              })
        console.log('DATA_LIST', DATA_LIST)
        setOpenBoxList(DATA_LIST)
        setDetailsLoading(false)
      }
    } catch (error) {
      console.log('err', error)
      setDetailsLoading(false)
    }
  }

  const getMarketOnSaleListAll = async ({
    collectibleAddedSource,
    collectibleRemovedSource,
    transferSource,
  }: {
    collectibleAddedSource: any[]
    collectibleRemovedSource: any[]
    transferSource: any[]
  }) => {
    let onSaleData = await getMarketOnSaleList({
      collectibleAddedSource,
      collectibleRemovedSource,
      transferSource,
    })
    let ontSaleData: CardType[] = []
    let transferCreateData: any[] = []
    let transferRemoveData: any[] = []
    let transferSourceDataArr: any[] = []

    transferSource.forEach((element: any, index: number) => {
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
        let uri = await constant.ContractMarketSharedToken.methods.tokenURI(item.tokenId).call()
        let cid = getIpfsHashFromBytes32(uri)
        let cidV1 = new CID(cid).toV1().toString('base32')
        const { axiosData, axiosDataTheme } = (await (
          await getLocal(cidV1)
        ).isAxiosTrue)
          ? await getLocal(cidV1)
          : await GetWeb3StorageJsonTwo(cidV1, retrieveFiles, client)
        let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(item.tokenId, web3.utils.toWei('1')).call()
        let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
        let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
        let time = await blockToTimestamp(web3, item.blockNumber)
        let categoriesName = await constant.ContractMarketSharedToken.methods.collectionURI(item.tokenId).call()
        let obj: CardType = {
          tokenId: item.tokenId,
          image: axiosData.imageFiles,
          cover: axiosData.coverFiles,
          name: axiosData.name,
          index: item.index,
          serialNumber: `market${item.tokenId.toString()}`,
          status: '2',
          isSell: false,
          blockNumber: item.blockNumber,
          nameTheme: axiosDataTheme.name,
          categoriesName,
          price: '0',
          address: item.to,
          collection: Market_ADDRESS,
          description: axiosData.description,
          royalty,
          time,
          royaltyAddress: royaltyCall[0],
        }
        if (axiosData.isDefault) obj.isDefault = axiosData.isDefault
        ontSaleData.push(obj)
      }
    }
    return {
      onSaleData,
      ontSaleData,
    }
  }

  const getMarketOnSaleList = async ({
    collectibleAddedSource,
    collectibleRemovedSource,
    transferSource,
  }: {
    collectibleAddedSource: any[]
    collectibleRemovedSource: any[]
    transferSource: any[]
  }) => {
    let collectibleAddedData: any[] = collectibleAddedSource.filter(
      (item) => item.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase(),
    )
    let collectibleRemovedData: any[] = collectibleRemovedSource.filter(
      (item) => item.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase(),
    )
    let transferSourceDataArr: any[] = transferSource.filter(
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
        image: axiosData.imageFiles,
        cover: axiosData.coverFiles,
        name: axiosData.name,
        index: item.index,
        serialNumber: `market${item.tokenId.toString()}`,
        status: '2',
        isSell: true,
        blockNumber: item.blockNumber,
        nameTheme: axiosDataTheme.name,
        categoriesName,
        price: item.price,
        address: item.seller,
        collection: item.collection,
        unit: payTokenOptions.find((pi) => pi.value === item.currency).label,
        collectibleHash: item.collectibleHash,
        description: axiosData.description,
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

  const getMarketListSource = async () => {
    try {
      if (apiKey === '' && apiUrl === '') {
        let collectibleAddedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleAdded')
        let collectibleRemovedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleRemoved')
        let transferSource: any = await readGetPastEvents(constant.ContractMarketSharedToken, 'Transfer')
        let purchasedSource: any = await readGetPastEvents(constant.ContractMarket, 'Purchased')

        return await {
          collectibleAddedSource: collectibleAddedSource.data,
          collectibleRemovedSource: collectibleRemovedSource.data,
          purchasedSource: purchasedSource.data,
          transferSource: transferSource.data,
        }
      } else {
        let topic0CollectibleAdded = await web3.utils.sha3(
          'CollectibleAdded(bytes32,bytes32,address,address,uint256,uint256,address,uint256)',
        )
        let topic0CollectibleRemoved = await web3.utils.sha3('CollectibleRemoved(bytes32,address,uint256,uint256)')
        let topic0Purchased = await web3.utils.sha3('Purchased(bytes32,address,address,uint256,uint256)')
        let topic0Transfer = await web3.utils.sha3('Transfer(address,address,uint256)')
        let arrRequest: ArrRequestType[] = [
          { address: Market_ADDRESS, apiKey, apiUrl, topic0: topic0CollectibleAdded, eventNme: 'CollectibleAdded' },
          { address: Market_ADDRESS, apiKey, apiUrl, topic0: topic0CollectibleRemoved, eventNme: 'CollectibleRemoved' },
          { address: Market_ADDRESS, apiKey, apiUrl, topic0: topic0Purchased, eventNme: 'Purchased' },
          { address: SharedToken_ADDRESS, apiKey, apiUrl, topic0: topic0Transfer, eventNme: 'Transfer' },
        ]
        let arrPromis: any[] = await Promise.all([
          readGetApiEvents(arrRequest[0]),
          readGetApiEvents(arrRequest[1]),
          readGetApiEvents(arrRequest[2]),
          readGetApiEvents(arrRequest[3]),
        ])

        return await {
          collectibleAddedSource: arrPromis[0].result,
          collectibleRemovedSource: arrPromis[1].result,
          purchasedSource: arrPromis[2].result,
          transferSource: arrPromis[3].result,
        }
      }
    } catch (error) {
      return await {
        collectibleAddedSource: [],
        collectibleRemovedSource: [],
        purchasedSource: [],
        transferSource: [],
      }
    }
  }

  const setParseSourceData = async ({
    collectibleAddedSource,
    collectibleRemovedSource,
    purchasedSource,
    transferSource,
  }: {
    collectibleAddedSource: any[]
    collectibleRemovedSource: any[]
    purchasedSource: any[]
    transferSource: any[]
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

  return { tradList, loading, openBoxList, detailsLoading }
}
