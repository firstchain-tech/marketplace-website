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

interface Type {
  myAddress: string
  isRefreshData: boolean
}

export const useMyNftHooks = (props: Type) => {
  const nftData: ConstantInitTypes = useDataHooks()
  const { constant, payTokenOptions, Market_ADDRESS, web3, apiKey, apiUrl, SharedToken_ADDRESS } = nftData
  const { myAddress, isRefreshData } = props

  const web3Store: StorageClientTypes = useWeb3StoreHooks()
  const { client } = web3Store

  const [myNftList, setMyNftList] = useState<CardType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (myAddress) {
      setMyNftList([])
      if (apiKey === '' && apiUrl === '') getMyNftList()
      if (apiKey !== '' && apiUrl !== '') getMyNftListApi()
    } else setLoading(false)
    return () => {
      setMyNftList([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myAddress, isRefreshData, apiKey, apiUrl])

  /** Get my nft purchase, transaction data */
  const getMyNftList = async () => {
    try {
      let purchaseOfList: any = await myPurchaseOfList()
      console.log('purchaseOfList', purchaseOfList)
      let saleOfList: any = await mySaleOfList()
      console.log('saleOfList', saleOfList)
      let DATA_LIST: CardType[] = [...purchaseOfList, ...saleOfList]
      DATA_LIST.sort(function (a: any, b: any) {
        return b.blockNumber - a.blockNumber
      })
      setMyNftList(DATA_LIST)
      setLoading(false)
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  const myPurchaseOfList = async () => {
    try {
      let transferSource: any = await readGetPastEvents(constant.ContractMarketSharedToken, 'Transfer')
      let myNftLength = await constant.ContractMarketSharedToken.methods.balanceOf(myAddress).call()
      let myTransferSource: any =
        myNftLength === '0' ? [] : await constant.ContractMarketSharedToken.methods.ownedTokens(myAddress, 0, myNftLength).call()
      let transferData: CardType[] = []
      for (let i = 0; i < transferSource.data.length; i++) {
        let element = transferSource.data[i]
        if (element.returnValues.from === '0x0000000000000000000000000000000000000000' && element.returnValues.to === myAddress) {
          let isStatusOne = myTransferSource.filter((ite: any) => ite === element.returnValues.tokenId)
          if (isStatusOne.length === 0) continue
          let uri = await constant.ContractMarketSharedToken.methods.tokenURI(element.returnValues.tokenId).call()
          let cid = getIpfsHashFromBytes32(uri)
          const { axiosData, axiosDataTheme } = await GetWeb3StorageJsonTwo(cid, retrieveFiles, client)
          let royaltyCall: any = await constant.ContractMarketSharedToken.methods
            .royaltyInfo(element.returnValues.tokenId, web3.utils.toWei('1'))
            .call()
          let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
          let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
          let time = await blockToTimestamp(web3, element.blockNumber)
          transferData.push({
            tokenId: element.returnValues.tokenId,
            index: i,
            serialNumber: `create${element.returnValues.tokenId.toString()}`,
            address: element.returnValues.to,
            isSelfBuilt: true,
            name: axiosData.name,
            image: axiosData.imageFiles,
            cover: axiosData.coverFiles,
            description: axiosData.description,
            categoriesName: axiosData.categoriesName,
            status: '0',
            nameTheme: axiosDataTheme.name,
            blockNumber: element.blockNumber,
            price: '0',
            royalty,
            time,
            royaltyAddress: royaltyCall[0],
          })
        }
      }
      let purchasedSource: any = await readGetPastEvents(constant.ContractMarket, 'Purchased')
      let purchasedData: CardType[] = []
      for (let i = 0; i < purchasedSource.data.length; i++) {
        let element = purchasedSource.data[i]
        if (element.returnValues.purchaser === myAddress) {
          let isStatusOne = myTransferSource.filter((ite: any) => ite === element.returnValues.tokenId)
          if (isStatusOne.length === 0) continue
          let uri = await constant.ContractMarketSharedToken.methods.tokenURI(element.returnValues.tokenId).call()
          let cid = getIpfsHashFromBytes32(uri)
          const { axiosData, axiosDataTheme } = await GetWeb3StorageJsonTwo(cid, retrieveFiles, client)
          let royaltyCall: any = await constant.ContractMarketSharedToken.methods
            .royaltyInfo(element.returnValues.tokenId, web3.utils.toWei('1'))
            .call()
          let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
          let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
          let time = await blockToTimestamp(web3, element.blockNumber)
          purchasedData.push({
            tokenId: element.returnValues.tokenId,
            index: i,
            serialNumber: `create${element.returnValues.tokenId.toString()}`,
            address: element.returnValues.purchaser,
            isSelfBuilt: axiosData.myAddress === myAddress,
            name: axiosData.name,
            image: axiosData.imageFiles,
            cover: axiosData.coverFiles,
            description: axiosData.description,
            categoriesName: axiosData.categoriesName,
            status: '1',
            nameTheme: axiosDataTheme.name,
            blockNumber: element.blockNumber,
            price: '0',
            royalty,
            time,
            royaltyAddress: royaltyCall[0],
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
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  const mySaleOfList = async () => {
    try {
      let collectibleAddedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleAdded')
      let collectibleRemovedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleRemoved')
      let collectibleAddedData: any[] = []
      let collectibleRemovedData: any[] = []
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
        collectibleAddedData.push(obj)
      })
      collectibleRemovedSource.data.forEach((element: any, index: number) => {
        let obj = {
          index,
          collectibleHash: element.returnValues.collectibleHash,
          blockNumber: element.blockNumber,
        }
        collectibleRemovedData.push(obj)
      })
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
      let length = await constant.ContractMarketSharedToken.methods.balanceOf(Market_ADDRESS).call()
      let marketOwnedTokens: any =
        length === '0' ? [] : await constant.ContractMarketSharedToken.methods.ownedTokens(Market_ADDRESS, 0, length).call()
      let DATA_LIST: CardType[] = []
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (item.seller !== myAddress) continue
        let isStatusOne = marketOwnedTokens.filter((ite: any) => ite === item.tokenId)
        if (isStatusOne.length === 0) continue
        let uri = await constant.ContractMarketSharedToken.methods.tokenURI(item.tokenId).call()
        let cid = getIpfsHashFromBytes32(uri)
        const { axiosData, axiosDataTheme } = await GetWeb3StorageJsonTwo(cid, retrieveFiles, client)
        let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(item.tokenId, item.price).call()
        let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(item.price).toFixed(6)
        let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
        let time = await blockToTimestamp(web3, item.blockNumber)
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
          categoriesName: axiosData.categoriesName,
          status: '2',
          price: item.price,
          collectibleHash: item.collectibleHash,
          unit: payTokenOptions.find((pi) => pi.value === item.currency).label,
          nameTheme: axiosDataTheme.name,
          royalty,
          time,
          royaltyAddress: royaltyCall[0],
        }
        DATA_LIST.push(obj)
      }
      return DATA_LIST
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  const getMyNftListApi = async () => {
    try {
      let topic0Transfer = await web3.utils.sha3('Transfer(address,address,uint256)')
      let topic0CollectibleAdded = await web3.utils.sha3(
        'CollectibleAdded(bytes32,bytes32,address,address,uint256,uint256,address,uint256)',
      )
      let topic0CollectibleRemoved = await web3.utils.sha3('CollectibleRemoved(bytes32)')
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

      let transferSource: any = arrPromis[0].result
      let collectibleAddedSource: any = arrPromis[1].result
      let collectibleRemovedSource: any = arrPromis[2].result
      let purchasedSource: any = arrPromis[3].result

      let purchaseOfList: any = await myPurchaseOfListApi(transferSource, purchasedSource)
      console.log('purchaseOfList', purchaseOfList)
      let saleOfList: any = await mySaleOfListApi(collectibleAddedSource, collectibleRemovedSource)
      console.log('saleOfList', saleOfList)
      let DATA_LIST: CardType[] = [...purchaseOfList, ...saleOfList]
      DATA_LIST.sort(function (a: any, b: any) {
        return b.blockNumber - a.blockNumber
      })
      setMyNftList(DATA_LIST)
      setLoading(false)
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  const myPurchaseOfListApi = async (transferSource: any, purchasedSource: any) => {
    try {
      let myNftLength = await constant.ContractMarketSharedToken.methods.balanceOf(myAddress).call()
      let myTransferSource: any =
        myNftLength === '0' ? [] : await constant.ContractMarketSharedToken.methods.ownedTokens(myAddress, 0, myNftLength).call()
      let transferData: CardType[] = []
      for (let i = 0; i < transferSource.length; i++) {
        let element = transferSource[i]
        let tokenId = web3.utils.hexToNumber(element.topics[3])
        let data: any = {
          from: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
          to: `0x${element.topics[2].substring(26, element.topics[2].length)}`,
          tokenId: tokenId.toString(),
        }
        let blockNumber: any = web3.utils.hexToNumber(element.blockNumber)
        if (data.from === '0x0000000000000000000000000000000000000000' && data.to === myAddress.toLowerCase()) {
          let isStatusOne = myTransferSource.filter((ite: any) => ite === data.tokenId)
          if (isStatusOne.length === 0) continue
          let uri = await constant.ContractMarketSharedToken.methods.tokenURI(data.tokenId).call()
          let cid = getIpfsHashFromBytes32(uri)

          const { axiosData, axiosDataTheme } = await GetWeb3StorageJsonTwo(cid, retrieveFiles, client)
          let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(data.tokenId, web3.utils.toWei('1')).call()
          let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
          let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
          let time = await blockToTimestamp(web3, blockNumber)
          transferData.push({
            tokenId: data.tokenId,
            index: i,
            serialNumber: `create${data.tokenId.toString()}`,
            address: data.to,
            isSelfBuilt: true,
            name: axiosData.name,
            image: axiosData.imageFiles,
            cover: axiosData.coverFiles,
            description: axiosData.description,
            categoriesName: axiosData.categoriesName,
            status: '1',
            nameTheme: axiosDataTheme.name,
            blockNumber,
            royalty,
            time,
            price: '0',
            royaltyAddress: royaltyCall[0],
          })
        }
      }

      let purchasedData: CardType[] = []
      let parameterArraypurchasedData = ['bytes32', 'uint256', 'uint256']
      for (let i = 0; i < purchasedSource.length; i++) {
        let element = purchasedSource[i]
        let parameters = web3.eth.abi.decodeParameters(parameterArraypurchasedData, element.data)
        let data: any = {
          tokenId: parameters[1],
          index: i,
          collectibleHash: parameters[0],
          purchaser: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
        }
        let blockNumber: any = web3.utils.hexToNumber(element.blockNumber)
        if (data.purchaser === myAddress.toLowerCase()) {
          let isStatusOne = myTransferSource.filter((ite: any) => ite === data.tokenId)
          if (isStatusOne.length === 0) continue
          let uri = await constant.ContractMarketSharedToken.methods.tokenURI(data.tokenId).call()
          let cid = getIpfsHashFromBytes32(uri)

          const { axiosData, axiosDataTheme } = await GetWeb3StorageJsonTwo(cid, retrieveFiles, client)
          let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(data.tokenId, web3.utils.toWei('1')).call()
          let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
          let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
          let time = await blockToTimestamp(web3, blockNumber)
          purchasedData.push({
            tokenId: data.tokenId,
            index: i,
            serialNumber: `create${data.tokenId.toString()}`,
            address: data.purchaser,
            isSelfBuilt: axiosData.myAddress === myAddress,
            name: axiosData.name,
            image: axiosData.imageFiles,
            cover: axiosData.coverFiles,
            description: axiosData.description,
            categoriesName: axiosData.categoriesName,
            status: '1',
            nameTheme: axiosDataTheme.name,
            blockNumber,
            royalty,
            time,
            price: '0',
            royaltyAddress: royaltyCall[0],
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
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  const mySaleOfListApi = async (collectibleAddedSource: any, collectibleRemovedSource: any) => {
    try {
      let collectibleAddedData: any[] = []
      let collectibleRemovedData: any[] = []
      let parameterArrayCollectibleAdded = ['bytes32', 'uint256', 'uint256', 'address', 'uint256']
      let parameterArrayCollectibleRemoved = ['bytes32']
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
        collectibleAddedData.push(obj)
      })
      collectibleRemovedSource.forEach((element: any, index: number) => {
        let blockNumber = web3.utils.hexToNumber(element.blockNumber)
        let parameters = web3.eth.abi.decodeParameters(parameterArrayCollectibleRemoved, element.data)
        let obj = {
          index,
          collectibleHash: parameters[0],
          blockNumber,
        }
        collectibleRemovedData.push(obj)
      })
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
      let length = await constant.ContractMarketSharedToken.methods.balanceOf(Market_ADDRESS).call()
      let marketOwnedTokens: any =
        length === '0' ? [] : await constant.ContractMarketSharedToken.methods.ownedTokens(Market_ADDRESS, 0, length).call()
      let DATA_LIST: CardType[] = []
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (item.seller !== myAddress.toLowerCase()) continue
        let isStatusOne = marketOwnedTokens.filter((ite: any) => ite === item.tokenId)
        if (isStatusOne.length === 0) continue
        let uri = await constant.ContractMarketSharedToken.methods.tokenURI(item.tokenId).call()
        let cid = getIpfsHashFromBytes32(uri)
        const { axiosData, axiosDataTheme } = await GetWeb3StorageJsonTwo(cid, retrieveFiles, client)
        let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(item.tokenId, item.price).call()
        let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(item.price).toFixed(6)
        let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
        let time = await blockToTimestamp(web3, item.blockNumber)
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
          categoriesName: axiosData.categoriesName,
          status: '2',
          price: item.price,
          collectibleHash: item.collectibleHash,
          unit: payTokenOptions.find((pi) => pi.value === item.currency).label,
          nameTheme: axiosDataTheme.name,
          royalty,
          time,
          royaltyAddress: royaltyCall[0],
        }
        DATA_LIST.push(obj)
      }
      return DATA_LIST
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  return { myNftList, loading }
}
