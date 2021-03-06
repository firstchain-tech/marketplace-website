import type { CardType, ArrRequestType } from '@/common/data.d'
import { useEffect, useState } from 'react'
import { objArrayDuplicateRemoval } from '@/utils'
import { readGetPastEvents, readGetApiEvents, blockToTimestamp } from '@/common'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { detailsImportApi, detailsImport } from '@/import/detailsImport'

interface Type {
  currentDetails: CardType
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

export const useDetailsHooks = (props: Type) => {
  const { currentDetails } = props

  const nftData: ConstantInitTypes = useDataHooks()
  const { constant, payTokenOptions, Market_ADDRESS, web3, toWeiFromMwei, toWeiFromWei, apiKey, apiUrl, SharedToken_ADDRESS } = nftData

  const [openBoxList, setOpenBoxList] = useState<OpenBoxType[]>([])
  const [detailsLoading, setDetailsLoading] = useState(true)

  useEffect(() => {
    setDetailsLoading(true)
    setOpenBoxList([])
    if (currentDetails.tokenId !== '' && apiKey === '' && apiUrl === '') getOpenBoxList()
    if (currentDetails.tokenId !== '' && apiKey !== '' && apiUrl !== '') getOpenBoxListApi()
    return () => {
      setDetailsLoading(false)
      setOpenBoxList([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDetails, apiKey, apiUrl])

  const getOpenBoxList = async () => {
    try {
      let purchasedDataSource = await getPurchasedList()
      let collectibleAddedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleAdded')
      let collectibleRemovedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleRemoved')
      let transferSource: any = await readGetPastEvents(constant.ContractMarketSharedToken, 'Transfer')
      let transferMyCreateData: any[] = []
      let transferSourceDataArr: any[] = []

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
      let collectibleAddedData: any[] = []
      let collectibleRemovedData: any[] = []
      let collectibleAddedDataImport: any[] = []
      let collectibleRemovedDataImport: any[] = []
      collectibleAddedSource.data.forEach((element: any, index: number) => {
        let obj = {
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
        }
        if (obj.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase()) collectibleAddedData.push(obj)
        else collectibleAddedDataImport.push(obj)
      })
      collectibleRemovedSource.data.forEach((element: any, index: number) => {
        let obj = {
          index,
          collectibleHash: element.returnValues.collectibleHash,
          blockNumber: element.blockNumber,
          collection: element.returnValues.collection,
        }
        if (obj.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase()) collectibleRemovedData.push(obj)
        else collectibleRemovedDataImport.push(obj)
      })
      if (!currentDetails.isImport) {
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
        let marketOwnedTokens = await getOwendTokendsData(arr2, arr3, Market_ADDRESS)
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
            let currentPurchaseInfo = purchasedDataSource.purchasedData.find((pi) => pi.collectibleHash === item.collectibleHash)
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
        setDetailsLoading(false)
        setOpenBoxList(DATA_LIST)
      } else {
        let DATA_LIST = await detailsImport({
          Market_ADDRESS,
          payTokenOptions,
          toWeiFromWei,
          toWeiFromMwei,
          currentDetails,
          web3,
          collectibleAddedData: collectibleAddedDataImport,
          collectibleRemovedData: collectibleRemovedDataImport,
          purchasedData: purchasedDataSource.purchasedDataImport,
        })
        console.log('DATA_LIST', DATA_LIST)
        setOpenBoxList(DATA_LIST)
        setDetailsLoading(false)
      }
    } catch (error) {
      setDetailsLoading(false)
      console.log('error', error)
    }
  }

  const getPurchasedList = async () => {
    let purchasedSource: any = await readGetPastEvents(constant.ContractMarket, 'Purchased')
    let purchasedData: any[] = []
    let purchasedDataImport: any[] = []
    for (let i = 0; i < purchasedSource.data.length; i++) {
      let element = purchasedSource.data[i]
      if (element.returnValues.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase())
        purchasedData.push({
          tokenId: element.returnValues.tokenId,
          index: i,
          collectibleHash: element.returnValues.collectibleHash,
          purchaser: element.returnValues.purchaser,
          blockNumber: element.blockNumber,
          collection: element.returnValues.collection,
          amount: element.returnValues.amount,
        })
      else
        purchasedDataImport.push({
          tokenId: element.returnValues.tokenId,
          index: i,
          collectibleHash: element.returnValues.collectibleHash,
          purchaser: element.returnValues.purchaser,
          blockNumber: element.blockNumber,
          collection: element.returnValues.collection,
          amount: element.returnValues.amount,
        })
    }
    return {
      purchasedData,
      purchasedDataImport,
    }
  }

  const getOpenBoxListApi = async () => {
    try {
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

      let collectibleAddedSource: any = arrPromis[0].result
      let collectibleRemovedSource: any = arrPromis[1].result
      let purchasedSource: any = arrPromis[2].result
      let transferSource: any = arrPromis[3].result

      let collectibleAddedData: any[] = []
      let collectibleRemovedData: any[] = []
      let purchasedData: any[] = []
      let transferMyCreateData: any[] = []
      let transferSourceDataArr: any[] = []

      let collectibleAddedDataImport: any[] = []
      let collectibleRemovedDataImport: any[] = []
      let purchasedDataImport: any[] = []

      let parameterArrayCollectibleAdded = ['bytes32', 'uint256', 'uint256', 'address', 'uint256']
      let parameterArrayCollectibleRemoved = ['bytes32', 'uint256', 'uint256']
      let parameterArraypurchasedData = ['bytes32', 'uint256', 'uint256']
      for (let i = 0; i < purchasedSource.length; i++) {
        let element = purchasedSource[i]
        let blockNumber = web3.utils.hexToNumber(element.blockNumber)
        let parameters = web3.eth.abi.decodeParameters(parameterArraypurchasedData, element.data)
        let collection = `0x${element.topics[2].substring(26, element.topics[2].length)}`
        if (collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase())
          purchasedData.push({
            tokenId: parameters[1],
            index: i,
            collectibleHash: parameters[0],
            purchaser: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
            blockNumber,
          })
        else
          purchasedDataImport.push({
            tokenId: parameters[1],
            index: i,
            collectibleHash: parameters[0],
            purchaser: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
            blockNumber,
          })
      }
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
        if (obj.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase()) collectibleAddedData.push(obj)
        else collectibleAddedDataImport.push(obj)
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
        if (obj.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase()) collectibleRemovedData.push(obj)
        else collectibleRemovedDataImport.push(obj)
      })
      if (!currentDetails.isImport) {
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
        let marketOwnedTokens = await getOwendTokendsData(arr2, arr3, Market_ADDRESS)

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
        setDetailsLoading(false)
        setOpenBoxList(DATA_LIST)
      } else {
        let DATA_LIST = await detailsImportApi({
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
        console.log('DATA_LIST', DATA_LIST)
        setOpenBoxList(DATA_LIST)
        setDetailsLoading(false)
      }
    } catch (error) {
      console.log('error', error)
      setDetailsLoading(false)
    }
  }

  /**
   *
   * @param mayExistArr Returns an array that must exist in the value
   * @param transferFilterArr transfer event filtered array (sell or buy market)
   * @param marketAddress Market contract address
   * @returns An array of tokenids that exist in the market
   */
  const getOwendTokendsData = async (mayExistArr: any[], transferFilterArr: any[], marketAddress: string) => {
    let marketOwnedTokens: string[] = []
    mayExistArr.forEach((item) => {
      let obj = transferFilterArr.find(
        (ite) =>
          ite.tokenId === item.tokenId &&
          ite.from.toLowerCase() !== marketAddress.toLowerCase() &&
          ite.to.toLowerCase() === marketAddress.toLowerCase(),
      )
      if (obj && obj instanceof Object) marketOwnedTokens.push(obj.tokenId)
    })
    // console.log('marketOwnedTokens', marketOwnedTokens)
    return marketOwnedTokens
  }

  return { openBoxList, detailsLoading }
}
