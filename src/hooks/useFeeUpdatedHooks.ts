import { useEffect, useState } from 'react'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { readGetPastEvents, readGetApiEvents } from '@/common'
import BigNumber from 'bignumber.js'
import type { ArrRequestType } from '@/common/data.d'

export const useFeeUpdatedHooks = () => {
  const nftData: ConstantInitTypes = useDataHooks()
  const { apiKey, apiUrl, constant, web3, Market_ADDRESS } = nftData

  const [serviceCharge, setServiceCharge] = useState<string>('2.5')

  useEffect(() => {
    if (apiKey === '' && apiUrl === '') getFeeUpdate()
    if (apiKey !== '' && apiUrl !== '') getFeeUpdateApi()
    return () => {
      setServiceCharge('2.5')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, apiUrl])

  const getFeeUpdate = async () => {
    try {
      let feeUpdatedSource: any = await readGetPastEvents(constant.ContractMarket, 'FeeUpdated')
      let feeUpdatedData: any[] = []
      feeUpdatedSource.data.forEach((element: any) => {
        feeUpdatedData.push({
          blockNumber: element.blockNumber,
          newFee: element.returnValues.newFee,
        })
      })
      feeUpdatedData.sort(function (a: any, b: any) {
        return b.blockNumber - a.blockNumber
      })
      if (feeUpdatedData.length > 0) {
        let feeData = new BigNumber(feeUpdatedData[0].newFee)
        let fee = feeData.div(100)
        setServiceCharge(Number(fee).toString())
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const getFeeUpdateApi = async () => {
    try {
      let topic0FeeUpdatedSource = await web3.utils.sha3('FeeUpdated(uint256,uint256)')
      let arrRequest: ArrRequestType[] = [
        { address: Market_ADDRESS, apiKey, apiUrl, topic0: topic0FeeUpdatedSource, eventNme: 'FeeUpdated' },
      ]
      let arrPromis: any[] = await Promise.all([readGetApiEvents(arrRequest[0])])
      let feeUpdatedSource: any = arrPromis[0].result
      let feeUpdatedData: any[] = []
      let parameterArrayfeeUpdatedData = ['uint256', 'uint256']

      for (let i = 0; i < feeUpdatedSource.length; i++) {
        let element = feeUpdatedSource[i]
        let blockNumber = web3.utils.hexToNumber(element.blockNumber)
        let parameters = web3.eth.abi.decodeParameters(parameterArrayfeeUpdatedData, element.data)
        feeUpdatedData.push({
          blockNumber,
          newFee: parameters[1],
        })
      }
      feeUpdatedData.sort(function (a: any, b: any) {
        return b.blockNumber - a.blockNumber
      })
      if (feeUpdatedData.length > 0) {
        let feeData = new BigNumber(feeUpdatedData[0].newFee)
        let fee = feeData.div(100)
        setServiceCharge(Number(fee).toString())
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  return { serviceCharge }
}
