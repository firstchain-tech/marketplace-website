import { CardType, ArrRequestType } from '@/common/data'
import { useEffect, useState } from 'react'
import type { PortfolioType } from '@/hooks/useCreateHooks'
import { readGetPastEvents, getIpfsHashFromBytes32, readGetApiEvents, GetWeb3StorageJsonOne, blockToTimestamp } from '@/common'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { objArrayDuplicateRemoval } from '@/utils'
import BigNumber from 'bignumber.js'

export interface ListType {
  key?: string | number
  serialNumber: string
  img: string
  name: string
  number: string | number
  list: CardType[]
  blockNumber: any
  value: string
}

interface Type {
  portfolioList: PortfolioType[]
  myAddress: string
}

export const useMyProjectHooks = (props: Type) => {
  const { portfolioList, myAddress } = props
  const nftData: ConstantInitTypes = useDataHooks()
  const { constant, payTokenOptions, Market_ADDRESS, apiKey, apiUrl, web3, SharedToken_ADDRESS } = nftData

  const [loading, setLoading] = useState<boolean>(true)
  const [myProjectList, setMyProjectList] = useState<ListType[]>([])

  useEffect(() => {
    setLoading(true)
    if (portfolioList && portfolioList.length > 0 && myProjectList.length === 0) {
      if (apiKey === '' && apiUrl === '') getList()
      if (apiKey !== '' && apiUrl !== '') getListApi()
    } else {
      setLoading(false)
    }
    return () => {
      setMyProjectList([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioList, apiKey, apiUrl])

  const getList = async () => {
    try {
      let arr: ListType[] = []
      let transferSource: any = await readGetPastEvents(constant.ContractMarketSharedToken, 'Transfer')
      let myNftLength = await constant.ContractMarketSharedToken.methods.balanceOf(myAddress).call()
      let myTransferSource: any =
        myNftLength === '0' ? [] : await constant.ContractMarketSharedToken.methods.ownedTokens(myAddress, 0, myNftLength).call()
      let myOnSaleData: any = await myOnSaleList()
      let transferData: CardType[] = []
      for (let i = 0; i < transferSource.data.length; i++) {
        let element = transferSource.data[i]
        if (element.returnValues.from === '0x0000000000000000000000000000000000000000' && element.returnValues.to === myAddress) {
          let isStatusOne = myTransferSource.filter((ite: any) => ite === element.returnValues.tokenId)
          if (isStatusOne.length === 0) continue
          let uri = await constant.ContractMarketSharedToken.methods.tokenURI(element.returnValues.tokenId).call()
          let cid = getIpfsHashFromBytes32(uri)
          const { axiosData } = await GetWeb3StorageJsonOne(cid)
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
            status: '1',
            price: '0',
            royalty,
            time,
            royaltyAddress: royaltyCall[0],
          })
        }
      }
      let listData = [...myOnSaleData, ...transferData]
      for (let i = 0; i < portfolioList.length; i++) {
        let obj: ListType = {
          key: i,
          serialNumber: `project${i.toString()}`,
          img: portfolioList[i].coverFiles,
          name: portfolioList[i].label,
          number: 0,
          list: [],
          blockNumber: portfolioList[i].blockNumber,
          value: portfolioList[i].value,
        }
        let list = listData.filter((item) => item.categoriesName === portfolioList[i].value)
        list.forEach((listObj) => {
          listObj.nameTheme = portfolioList[i].label
        })
        obj.list = list
        obj.number = list.length
        arr.push(obj)
      }
      setMyProjectList(arr)
      setTimeout(() => {
        setLoading(false)
      }, 5000)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const myOnSaleList = async () => {
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
        const { axiosData } = await GetWeb3StorageJsonOne(cid)
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
          royalty,
          time,
          royaltyAddress: royaltyCall[0],
        }
        DATA_LIST.push(obj)
      }
      return DATA_LIST
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const getListApi = async () => {
    try {
      let topic0Transfer = await web3.utils.sha3('Transfer(address,address,uint256)')
      let topic0CollectibleAdded = await web3.utils.sha3(
        'CollectibleAdded(bytes32,bytes32,address,address,uint256,uint256,address,uint256)',
      )
      let topic0CollectibleRemoved = await web3.utils.sha3('CollectibleRemoved(bytes32)')
      let arrRequest: ArrRequestType[] = [
        { address: SharedToken_ADDRESS, apiKey, apiUrl, topic0: topic0Transfer, eventNme: 'Transfer' },
        { address: Market_ADDRESS, apiKey, apiUrl, topic0: topic0CollectibleAdded, eventNme: 'CollectibleAdded' },
        { address: Market_ADDRESS, apiKey, apiUrl, topic0: topic0CollectibleRemoved, eventNme: 'CollectibleRemoved' },
      ]
      let arrPromis: any[] = await Promise.all([
        readGetApiEvents(arrRequest[0]),
        readGetApiEvents(arrRequest[1]),
        readGetApiEvents(arrRequest[2]),
      ])
      let transferSource: any = arrPromis[0].result
      let myOnSaleData: any = await myOnSaleListApi(arrPromis[1].result, arrPromis[2].result)
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
        if (data.from === '0x0000000000000000000000000000000000000000' && data.to === myAddress.toLowerCase()) {
          let isStatusOne = myTransferSource.filter((ite: any) => ite === data.tokenId)
          if (isStatusOne.length === 0) continue
          let uri = await constant.ContractMarketSharedToken.methods.tokenURI(data.tokenId).call()
          let cid = getIpfsHashFromBytes32(uri)
          const { axiosData } = await GetWeb3StorageJsonOne(cid)
          let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(data.tokenId, web3.utils.toWei('1')).call()
          let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
          let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
          let blockNumber = web3.utils.hexToNumber(element.blockNumber)
          let time = await blockToTimestamp(web3, blockNumber as any)
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
            price: '0',
            royalty,
            time,
            royaltyAddress: royaltyCall[0],
          })
        }
      }
      let listData = [...myOnSaleData, ...transferData]
      let arr: ListType[] = []
      for (let i = 0; i < portfolioList.length; i++) {
        let obj: ListType = {
          key: i,
          serialNumber: `project${i.toString()}`,
          img: portfolioList[i].coverFiles,
          name: portfolioList[i].label,
          number: 0,
          list: [],
          blockNumber: portfolioList[i].blockNumber,
          value: portfolioList[i].value,
        }
        let list = listData.filter((item) => item.categoriesName === portfolioList[i].value)
        list.forEach((listObj) => {
          listObj.nameTheme = portfolioList[i].label
        })
        obj.list = list
        obj.number = list.length
        arr.push(obj)
      }
      console.log('arr', arr)
      setMyProjectList(arr)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const myOnSaleListApi = async (collectibleAddedSource: any, collectibleRemovedSource: any) => {
    try {
      let parameterArrayCollectibleAdded = ['bytes32', 'uint256', 'uint256', 'address', 'uint256']
      let parameterArrayCollectibleRemoved = ['bytes32']
      let collectibleAddedData: any[] = []
      let collectibleRemovedData: any[] = []
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
        const { axiosData } = await GetWeb3StorageJsonOne(cid)
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
          royalty,
          time,
          royaltyAddress: royaltyCall[0],
        }
        DATA_LIST.push(obj)
      }
      return DATA_LIST
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return { myProjectList, loading }
}
