import { CardType, ArrRequestType } from '@/common/data'
import { useEffect, useState } from 'react'
import { readGetPastEvents, getIpfsHashFromBytes32, readGetApiEvents, GetWeb3StorageJsonOne, blockToTimestamp } from '@/common'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { objArrayDuplicateRemoval } from '@/utils'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { myProjectImport } from '@/import/myProjectImport'
import { getOwendTokendsMarketData, getOwendTokendsMyNftData } from '@/import/owendTokens'
import CID from 'cids'

export interface ListType {
  key?: string | number
  serialNumber: string
  img: string
  name: string
  number: string | number
  list: CardType[]
  blockNumber: any
  value: string
  isImport: boolean
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

export interface ImportListType {
  contracts: string
  key?: string | number
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

interface Type {
  myAddress: string
  isRefreshData: boolean
}

export const useMyProjectHooks = (props: Type) => {
  const { myAddress, isRefreshData } = props
  const nftData: ConstantInitTypes = useDataHooks()
  const { constant, payTokenOptions, Market_ADDRESS, apiKey, apiUrl, web3, SharedToken_ADDRESS, Categories_ADDRESS } = nftData

  const [loading, setLoading] = useState<boolean>(true)
  const [myProjectList, setMyProjectList] = useState<ListType[]>([])
  const [myImportProjectList, setImportMyProjectList] = useState<ImportListType[]>([])
  const { web3StorageList } = useSelector((state: any) => state.infoInfo)

  useEffect(() => {
    setMyProjectList([])
    setImportMyProjectList([])
    getPlist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, apiUrl, myAddress, isRefreshData])

  const getPlist = async () => {
    setLoading(true)
    let portfolioList = await getPortfolioImportList()
    console.log('portfolioList', portfolioList)
    if (portfolioList.length > 0) getProjectList(portfolioList)
    else setLoading(false)
  }

  const getProjectList = async (portfolioList: PortfolioImportType[]) => {
    setLoading(true)
    try {
      let source = await getProjectListSource()
      let parseSourceData = await setParseSourceData(source)
      const transferData = await transferDataList(parseSourceData.collectibleTransferSourceSourceData)
      const myOnSaleData: any = await myOnSaleList(
        parseSourceData.collectibleAddedSourceData,
        parseSourceData.collectibleRemovedSourceData,
        parseSourceData.collectibleTransferSourceSourceData,
      )
      let listData = [...myOnSaleData.DATA_LIST, ...transferData]
      console.log('listData', listData)
      let importList: ImportListType[] = []
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
          isImport: portfolioList[i].isImport,
        }
        let list = !portfolioList[i].isImport
          ? listData.filter((item) => item.categoriesName.toLowerCase() === portfolioList[i].value.toLowerCase())
          : await myProjectImport({
              Market_ADDRESS,
              payTokenOptions,
              myAddress,
              web3,
              CollectibleAdded: myOnSaleData.collectibleAddedDataImport.filter(
                (fi: any) => fi.collection.toLowerCase() === portfolioList[i].contracts.toLowerCase(),
              ),
              CollectibleRemoved: myOnSaleData.collectibleRemovedDataImport.filter(
                (fi: any) => fi.collection.toLowerCase() === portfolioList[i].contracts.toLowerCase(),
              ),
              portfolioObj: portfolioList[i],
              apiKey,
              apiUrl,
            })
        list.forEach((listObj) => {
          listObj.nameTheme = portfolioList[i].label
        })
        obj.list = list
        obj.number = list.length
        arr.push(obj)
        if (portfolioList[i].isImport) {
          importList.push({
            key: i,
            contracts: portfolioList[i].contracts,
          })
        }
      }
      console.log('arr', arr)
      console.log('importList', importList)
      setImportMyProjectList(importList)
      setMyProjectList(arr)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const getProjectListSource = async () => {
    try {
      if (apiKey === '' && apiUrl === '') {
        let transferSource: any = await readGetPastEvents(constant.ContractMarketSharedToken, 'Transfer')
        let collectibleAddedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleAdded')
        let collectibleRemovedSource: any = await readGetPastEvents(constant.ContractMarket, 'CollectibleRemoved')
        return await {
          transferSource: transferSource.data,
          collectibleAddedSource: collectibleAddedSource.data,
          collectibleRemovedSource: collectibleRemovedSource.data,
        }
      } else {
        let topic0Transfer = await web3.utils.sha3('Transfer(address,address,uint256)')
        let topic0CollectibleAdded = await web3.utils.sha3(
          'CollectibleAdded(bytes32,bytes32,address,address,uint256,uint256,address,uint256)',
        )
        let topic0CollectibleRemoved = await web3.utils.sha3('CollectibleRemoved(bytes32,address,uint256,uint256)')
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

        return await {
          transferSource: arrPromis[0].result,
          collectibleAddedSource: arrPromis[1].result,
          collectibleRemovedSource: arrPromis[2].result,
        }
      }
    } catch (error) {
      console.log('error', error)
      return await {
        transferSource: [],
        collectibleAddedSource: [],
        collectibleRemovedSource: [],
      }
    }
  }

  const setParseSourceData = async ({
    transferSource,
    collectibleAddedSource,
    collectibleRemovedSource,
  }: {
    transferSource: any[]
    collectibleAddedSource: any[]
    collectibleRemovedSource: any[]
  }) => {
    let collectibleAddedSourceData: any[] = []
    let collectibleRemovedSourceData: any[] = []
    let collectibleTransferSourceSourceData: any[] = []

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
            blockNumber: element.blockNumber,
            from: element.returnValues.from,
            to: element.returnValues.to,
            tokenId: element.returnValues.tokenId,
          })
        })

        return await {
          collectibleAddedSourceData,
          collectibleRemovedSourceData,
          collectibleTransferSourceSourceData,
        }
      } else {
        let parameterArrayCollectibleAdded = ['bytes32', 'uint256', 'uint256', 'address', 'uint256']
        let parameterArrayCollectibleRemoved = ['bytes32', 'uint256', 'uint256']

        collectibleAddedSource.forEach((element: any, index: number) => {
          let blockNumber = web3.utils.hexToNumber(element.blockNumber)
          let parameters = web3.eth.abi.decodeParameters(parameterArrayCollectibleAdded, element.data)
          collectibleAddedSourceData.push({
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
          })
        })

        collectibleRemovedSource.forEach((element: any, index: number) => {
          let blockNumber = web3.utils.hexToNumber(element.blockNumber)
          let parameters = web3.eth.abi.decodeParameters(parameterArrayCollectibleRemoved, element.data)
          collectibleRemovedSourceData.push({
            index,
            collectibleHash: parameters[0],
            blockNumber,
            collection: `0x${element.topics[1].substring(26, element.topics[1].length)}`,
          })
        })

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
          collectibleAddedSourceData,
          collectibleRemovedSourceData,
          collectibleTransferSourceSourceData,
        }
      }
    } catch (error) {
      console.log('error', error)
      return await {
        collectibleAddedSourceData,
        collectibleRemovedSourceData,
        collectibleTransferSourceSourceData,
      }
    }
  }

  const transferDataList = async (transferSourceData: any[]) => {
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
        if (item.from === '0x0000000000000000000000000000000000000000' && item.to.toLowerCase() === myAddress.toLowerCase()) {
          let isStatusOne = myTransferSource.filter((ite: any) => ite === item.tokenId)
          if (isStatusOne.length === 0) continue
          let uri = await constant.ContractMarketSharedToken.methods.tokenURI(item.tokenId).call()
          let cid = getIpfsHashFromBytes32(uri)
          let cidV1 = new CID(cid).toV1().toString('base32')
          let web3StorageData = web3StorageList.filter((item: any) => item.cid === cidV1)
          const axiosData =
            web3StorageData && web3StorageData.length > 0
              ? web3StorageData[0].jsonSource
              : await (
                  await GetWeb3StorageJsonOne(cidV1)
                ).axiosData
          let royaltyCall: any = await constant.ContractMarketSharedToken.methods.royaltyInfo(item.tokenId, web3.utils.toWei('1')).call()
          let royaltyB = royaltyCall[1] === '0' ? '0' : new BigNumber(royaltyCall[1]).div(web3.utils.toWei('1')).toFixed(6)
          let royalty = royaltyB === '0' ? '0' : new BigNumber(royaltyB).multipliedBy(100).toFixed(4)
          let time = await blockToTimestamp(web3, item.blockNumber)
          let categoriesName = await constant.ContractMarketSharedToken.methods.collectionURI(item.tokenId).call()
          let obj: any = {
            tokenId: item.tokenId,
            index: i,
            serialNumber: `create${item.tokenId.toString()}`,
            address: item.to,
            isSelfBuilt: true,
            name: axiosData.name,
            image: axiosData.imageFiles,
            cover: axiosData.coverFiles,
            description: axiosData.description,
            categoriesName,
            status: '1',
            price: '0',
            royalty,
            time,
            royaltyAddress: royaltyCall[0],
          }
          if (axiosData.isDefault) obj.isDefault = axiosData.isDefault
          transferData.push(obj)
        }
      }
      return await transferData
    } catch (error) {
      console.log('err', error)
      return await []
    }
  }

  const myOnSaleList = async (addedSourceData: any[], removedSourceData: any[], transferSourceData: any[]) => {
    try {
      let collectibleAddedData: any[] = addedSourceData.filter(
        (item) => item.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase(),
      )
      let collectibleAddedDataImport: any[] = addedSourceData.filter(
        (item) => item.collection.toLowerCase() !== SharedToken_ADDRESS.toLowerCase(),
      )
      let collectibleRemovedData: any[] = removedSourceData.filter(
        (item) => item.collection.toLowerCase() === SharedToken_ADDRESS.toLowerCase(),
      )
      let collectibleRemovedDataImport: any[] = removedSourceData.filter(
        (item) => item.collection.toLowerCase() !== SharedToken_ADDRESS.toLowerCase(),
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
        let uri = await constant.ContractMarketSharedToken.methods.tokenURI(item.tokenId).call()
        let cid = getIpfsHashFromBytes32(uri)
        let cidV1 = new CID(cid).toV1().toString('base32')
        let web3StorageData = web3StorageList.filter((item: any) => item.cid === cidV1)
        const axiosData =
          web3StorageData && web3StorageData.length > 0
            ? web3StorageData[0].jsonSource
            : await (
                await GetWeb3StorageJsonOne(cidV1)
              ).axiosData
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
          royalty,
          time,
          royaltyAddress: royaltyCall[0],
        }
        if (axiosData.isDefault) obj.isDefault = axiosData.isDefault
        DATA_LIST.push(obj)
      }
      return {
        DATA_LIST,
        collectibleRemovedDataImport,
        collectibleAddedDataImport,
      }
    } catch (error) {
      console.log('error', error)
      return {
        DATA_LIST: [],
        collectibleRemovedDataImport: [],
        collectibleAddedDataImport: [],
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
    console.log('addedData',addedData)
    console.log('arr1', arr1)
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
      if (arr1[i].account.toLowerCase() === myAddress.toLowerCase())
        DATA_LIST.push({
          key: i,
          label: axiosData.isDefault ? `${axiosData.name}` : axiosData.name,
          value: arr1[i].name,
          blockNumber: arr1[i].blockNumber,
          cover: axiosData.cover,
          coverFiles: axiosData.coverFiles,
          isImport: arr1[i].colletion.toLowerCase() !== SharedToken_ADDRESS.toLowerCase() ? true : false,
          contracts: arr1[i].colletion.toLowerCase(),
        })
    }
    let arr = DATA_LIST
    return await arr
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

  return { myProjectList, loading, myImportProjectList }
}
