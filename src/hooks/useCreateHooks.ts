import { useEffect, useState } from 'react'
import { readGetPastEvents, getIpfsHashFromBytes32, readGetApiEvents } from '@/common'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { ArrRequestType } from '@/common/data.d'
import { GetWeb3StorageJsonOne } from '@/common'

export interface PortfolioType {
  key?: string | number
  label: string
  value: string
  blockNumber: number
  cover: string
  coverFiles: string
}

interface Type {
  myAddress: string
  isRefreshData: boolean
}

interface DataType {
  name: string
  blockNumber: number
}

export const useCreateHooks = (props: Type) => {
  const nftData: ConstantInitTypes = useDataHooks()
  const { constant, apiKey, apiUrl, web3, Categories_ADDRESS } = nftData

  const { myAddress, isRefreshData } = props

  const [portfolioList, setPortfolioList] = useState<PortfolioType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    if (myAddress && apiKey === '' && apiUrl === '') getPortfolioList()
    if (myAddress && apiKey !== '' && apiUrl !== '') getPortfolioListApi()
    return () => {
      setPortfolioList([])
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myAddress, isRefreshData, apiKey, apiUrl])

  const getPortfolioList = async () => {
    try {
      let addedSource: any = await readGetPastEvents(constant.ContractCategories, 'Added')
      let removedSource: any = await readGetPastEvents(constant.ContractCategories, 'Removed')
      let addedData: DataType[] = []
      let removedData: DataType[] = []
      addedSource.data.forEach((element: any) => {
        addedData.push({
          name: element.returnValues.name,
          blockNumber: element.blockNumber,
        })
      })
      removedSource.data.forEach((element: any) => {
        removedData.push({
          name: element.returnValues.name,
          blockNumber: element.blockNumber,
        })
      })
      let arr1: DataType[] = []
      addedData.forEach((data) => {
        let filter = removedData.filter((item) => item.name === data.name)
        if (filter.length === 0) arr1.push(data)
      })
      let DATA_LIST: PortfolioType[] = []
      for (let i = 0; i < arr1.length; i++) {
        let cid = getIpfsHashFromBytes32(arr1[i].name)
        const { axiosData } = await GetWeb3StorageJsonOne(cid)
        if (axiosData.myAddress === myAddress)
          DATA_LIST.push({
            key: i,
            label: axiosData.name,
            value: arr1[i].name,
            blockNumber: arr1[i].blockNumber,
            cover: axiosData.cover,
            coverFiles: axiosData.coverFiles,
          })
      }
      setPortfolioList(DATA_LIST)
      console.log('MyCreateProject', DATA_LIST)
      setLoading(false)
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  const getPortfolioListApi = async () => {
    try {
      let topic0Added = await web3.utils.sha3('Added(bytes32)')
      let topic0Removed = await web3.utils.sha3('Removed(bytes32)')
      let parameterArrayAdded = ['bytes32']
      let parameterArrayRemoved = ['bytes32']
      let arrRequest: ArrRequestType[] = [
        { address: Categories_ADDRESS, apiKey, apiUrl, topic0: topic0Added, eventNme: 'Added' },
        { address: Categories_ADDRESS, apiKey, apiUrl, topic0: topic0Removed, eventNme: 'Removed' },
      ]
      let arrPromis: any[] = await Promise.all([readGetApiEvents(arrRequest[0]), readGetApiEvents(arrRequest[1])])
      let addedSource: any = arrPromis[0].result
      let removedSource: any = arrPromis[1].result
      let addedData: DataType[] = []
      let removedData: DataType[] = []
      addedSource.forEach((item: any) => {
        let parameters = web3.eth.abi.decodeParameters(parameterArrayAdded, item.data)
        let blockNumber = web3.utils.hexToNumber(item.blockNumber)
        let data: any = {
          name: parameters[0],
          blockNumber,
        }
        addedData.push(data)
      })
      removedSource.forEach((item: any) => {
        let parameters = web3.eth.abi.decodeParameters(parameterArrayRemoved, item.data)
        let blockNumber = web3.utils.hexToNumber(item.blockNumber)
        let data: any = {
          name: parameters[0],
          blockNumber,
        }
        removedData.push(data)
      })
      let arr1: DataType[] = []
      addedData.forEach((data) => {
        let filter = removedData.filter((item) => item.name === data.name)
        if (filter.length === 0) arr1.push(data)
      })
      let DATA_LIST: PortfolioType[] = []
      for (let i = 0; i < arr1.length; i++) {
        let cid = getIpfsHashFromBytes32(arr1[i].name)
        const { axiosData } = await GetWeb3StorageJsonOne(cid)
        if (axiosData.myAddress === myAddress)
          DATA_LIST.push({
            key: i,
            label: axiosData.name,
            value: arr1[i].name,
            blockNumber: arr1[i].blockNumber,
            cover: axiosData.cover,
            coverFiles: axiosData.coverFiles,
          })
      }
      setPortfolioList(DATA_LIST)
      console.log('MyCreateProject', DATA_LIST)
      setLoading(false)
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  return { portfolioList, protfolioLoading: loading }
}
