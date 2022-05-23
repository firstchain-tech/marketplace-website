import { useEffect, useState } from 'react'
import { CardType, ArrRequestType } from '@/common/data.d'
import { readGetPastEvents, getIpfsHashFromBytes32, readGetApiEvents, GetWeb3StorageJsonOne } from '@/common'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'

export const useHomeHooks = () => {
  const nftData: ConstantInitTypes = useDataHooks()
  const { constant, web3, apiKey, apiUrl, SharedToken_ADDRESS } = nftData

  const [homeList, setHomeList] = useState<CardType[]>([])

  useEffect(() => {
    if (apiKey === '' && apiUrl === '') getList()
    if (apiKey !== '' && apiUrl !== '') getListApi()
    return () => setHomeList([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, apiUrl])

  const getList = async () => {
    try {
      let transferSource: any = await readGetPastEvents(constant.ContractMarketSharedToken, 'Transfer')
      transferSource.data.sort(function (a: any, b: any) {
        return b.blockNumber - a.blockNumber
      })
      let transferData: CardType[] = []
      for (let i = 0; i < transferSource.data.length; i++) {
        let element = transferSource.data[i]
        if (element.returnValues.from === '0x0000000000000000000000000000000000000000') {
          if (transferData.length >= 2) continue
          let uri = await constant.ContractMarketSharedToken.methods.tokenURI(element.returnValues.tokenId).call()
          let cid = getIpfsHashFromBytes32(uri)
          const { axiosData } = await GetWeb3StorageJsonOne(cid)
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
            blockNumber: element.blockNumber,
          })
        }
      }
      setHomeList(transferData)
    } catch (error) {
      console.log('err', error)
    }
  }

  const getListApi = async () => {
    try {
      let topic0Transfer = await web3.utils.sha3('Transfer(address,address,uint256)')
      let arrRequest: ArrRequestType[] = [{ address: SharedToken_ADDRESS, apiKey, apiUrl, topic0: topic0Transfer, eventNme: 'Transfer' }]
      let arrPromis: any[] = await Promise.all([readGetApiEvents(arrRequest[0])])
      let transferSource: any = arrPromis[0].result
      transferSource.sort(function (a: any, b: any) {
        let ABlockNumber = web3.utils.hexToNumber(a.blockNumber)
        let BblockNumber = web3.utils.hexToNumber(b.blockNumber)
        return BblockNumber - ABlockNumber
      })
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

        if (data.from === '0x0000000000000000000000000000000000000000') {
          if (transferData.length >= 2) continue
          let uri = await constant.ContractMarketSharedToken.methods.tokenURI(data.tokenId).call()
          let cid = getIpfsHashFromBytes32(uri)
          const { axiosData } = await GetWeb3StorageJsonOne(cid)
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
            blockNumber,
          })
        }
      }
      setHomeList(transferData)
    } catch (error) {
      console.log('err', error)
    }
  }

  return { homeList }
}
