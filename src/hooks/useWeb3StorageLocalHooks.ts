import useWeb3StoreHooks from '@/hooks/useWeb3StoreHooks'
import type { StorageClientTypes } from '@/contracts/web3StorageInit'
import { useEffect, useState } from 'react'
// import { create } from 'ipfs-http-client'
import axios from 'axios'
import { isJson } from '@/utils'
import { useDispatch } from 'react-redux'
import { SaveInfoWeb3Storage } from '@/store/info/action'

interface Type {
  isRefreshData: boolean
}

export const useWeb3StorageLocalHooks = (props: Type) => {
  const { isRefreshData } = props
  const dispatch = useDispatch()

  const web3Store: StorageClientTypes = useWeb3StoreHooks()
  const { client } = web3Store

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getLocal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshData])

  const getLocal = async () => {
    let address = localStorage.getItem('web3storage_key') || ''
    if (address !== (process.env as any).REACT_APP_LICENSE) {
      let localLength = localStorage.getItem('web3storage_number') || '0'
      for (let i = 0; i < Number(localLength); i++) {
        localStorage.removeItem(`web3storage_list_${i}`)
      }
      localStorage.removeItem('web3storage_number')
      getList([])
    } else {
      let localLength = localStorage.getItem('web3storage_number') || '0'
      let localWeb3StorageList = []
      for (let i = 0; i < Number(localLength); i++) {
        let obj: any = localStorage.getItem(`web3storage_list_${i}`)
        let listObj = JSON.parse(obj)
        localWeb3StorageList.push(...listObj)
      }
      getList(localWeb3StorageList)
    }
  }

  // const getLinks = async (ipfsPath: string) => {
  //   const url = 'https://dweb.link/api/v0'
  //   const ipfs = create({ url })
  //   const links = []
  //   for await (const link of ipfs.ls(ipfsPath)) {
  //     links.push(link)
  //   }
  //   return links
  // }

  const getList = async (localWeb3StorageList: any[]) => {
    if (localWeb3StorageList.length === 0) localStorage.setItem('web3storage_key', (process.env as any).REACT_APP_LICENSE)
    let axiosUploadList: { cid: string; name: string }[] = []
    for await (const upload of client.list()) {
      const ext = upload.name.split('.').pop()
      if (ext === 'json' && upload.pins.length > 0) {
        // let cid = new CID(upload.cid).toV1().toString('base58btc')
        let errArr = upload.pins.filter((item: any) => item.status !== 'Pinned')
        if (errArr.length === 0) axiosUploadList.push({ cid: upload.cid, name: upload.name })
      }
    }

    let arrList: { cid: string; jsonSource: any }[] = []
    let NoLocalList = axiosUploadList.filter((item) => !localWeb3StorageList.some((ele) => ele.cid === item.cid))
    let YesLocalList = localWeb3StorageList.filter((item) => axiosUploadList.some((ele) => ele.cid === item.cid))
    for (let i = 0; i < NoLocalList.length; i++) {
      let item = NoLocalList[i]
      let axiosDataFetch = await axios.get(`https://api.web3.storage/car/${item.cid}`, {
        headers: {
          'Content-Type': 'application/vnd.ipld.car',
          Authorizations: `Bearer ${(process.env as any).REACT_APP_LICENSE}`,
        },
      })
      let json = axiosDataFetch.data.substr(axiosDataFetch.data.indexOf(`{"name`), axiosDataFetch.data.length)
      if (isJson(json))
        arrList.push({
          cid: item.cid,
          jsonSource: await JSON.parse(json),
        })
    }
    let list = [...YesLocalList, ...arrList]

    if (list.length > 0) {
      let sizeObj = getLocalStorageSize(JSON.stringify(list))
      let sizeArrLength = Math.ceil(sizeObj.size / 5242880)
      let newResult = await getArrGrouping(list, Math.ceil(list.length / sizeArrLength))
      localStorage.setItem('web3storage_number', newResult.length.toString())
      for (let i = 0; i < newResult.length; i++) {
        localStorage.setItem(`web3storage_list_${i}`, JSON.stringify(newResult[i]))
      }
    }

    dispatch(SaveInfoWeb3Storage(list))
    setLoading(false)
  }

  const getLocalStorageSize = (str: string) => {
    let size = JSON.stringify(str).length * 2
    const arr = ['bytes', 'KB', 'MB', 'GB', 'TB']
    let sizeUnit = 0
    while (size > 1024) {
      size /= 1024
      ++sizeUnit
    }
    return {
      size: Math.ceil(size),
      name: `size:${size.toFixed(2)}${arr[sizeUnit]}`,
    }
  }

  const getArrGrouping = async (arr: any[], size: number) => {
    const arrNum = Math.ceil(arr.length / size)
    let index = 0
    let resIndex = 0
    const result = []
    while (index < arrNum) {
      result[index] = arr.slice(resIndex, size + resIndex)
      resIndex += size
      index++
    }
    return result
  }

  return { loading }
}
