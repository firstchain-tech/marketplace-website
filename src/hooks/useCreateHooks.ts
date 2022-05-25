import { useEffect, useState } from 'react'
import { readGetPastEvents, getIpfsHashFromBytes32, readGetApiEvents } from '@/common'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { ArrRequestType } from '@/common/data.d'
import { GetWeb3StorageJsonOne } from '@/common'
import { useSelector } from 'react-redux'
import CID from 'cids'

export interface PortfolioType {
  key?: string | number
  label: string
  value: string
  blockNumber: number
  cover: string
  coverFiles: string
  isImport: boolean
  contracts: any
}

interface Type {
  myAddress: string
  isRefreshData: boolean
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

export const useCreateHooks = (props: Type) => {
  const nftData: ConstantInitTypes = useDataHooks()
  const { constant, apiKey, apiUrl, web3, Categories_ADDRESS, SharedToken_ADDRESS } = nftData

  const { myAddress, isRefreshData } = props

  const [portfolioList, setPortfolioList] = useState<PortfolioType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { web3StorageList } = useSelector((state: any) => state.infoInfo)

  useEffect(() => {
    if (myAddress) getPortfolioList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myAddress, isRefreshData, apiKey, apiUrl])

  const getPortfolioList = async () => {
    try {
      setLoading(true)
      let source = await getPortfolioSource()
      let parseSourceData = await setPortfolioParseSourceData(source)

      let addedData = parseSourceData.addedData
      let removedData = parseSourceData.removedData
      let arr1: DataAddType[] = []
      addedData.forEach((data) => {
        let filter = removedData.filter((item) => item.collectionHash.toLowerCase() === data.collectionHash.toLowerCase())
        if (filter.length === 0) arr1.push(data)
      })
      let DATA_LIST: PortfolioType[] = []
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
            label: axiosData.isDefault ? `${axiosData.name}${i}` : axiosData.name,
            value: arr1[i].name,
            blockNumber: arr1[i].blockNumber,
            cover: axiosData.cover,
            coverFiles: axiosData.coverFiles,
            isImport: arr1[i].colletion.toLowerCase() !== SharedToken_ADDRESS.toLowerCase() ? true : false,
            contracts: arr1[i].colletion.toLowerCase(),
          })
      }
      let arr = DATA_LIST.filter((item) => item.isImport === false)
      setPortfolioList(arr)
      console.log('MyCreateProject', arr)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const getPortfolioSource = async () => {
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

  const setPortfolioParseSourceData = async ({ addedSource, removedSource }: { addedSource: any[]; removedSource: any[] }) => {
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

  return { portfolioList, protfolioLoading: loading }
}
