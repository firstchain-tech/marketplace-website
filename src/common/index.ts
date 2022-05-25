import Web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import bs58 from 'bs58'
import type { ArrRequestType } from '@/common/data.d'
import request from '@/utils/request'
import CID from 'cids'
import { SaveInfoWeb3Storage } from '@/store/info/action'
import { isJson } from '@/utils'
import { Default_data, Default_data_theme } from '@/common/init'

export const getBytes32FromIpfsHash = (ipfsListing: any) => {
  return '0x' + bs58.decode(ipfsListing).slice(2).toString('hex')
}

export const getIpfsHashFromBytes32 = (bytes32Hex: any) => {
  const hashHex = '1220' + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex')
  const hashStr = bs58.encode(hashBytes)
  return hashStr
}

/** read historical events  */
export const readGetPastEvents = (contract: any, events: string, filter?: object) => {
  return new Promise((reslove, reject) => {
    contract.getPastEvents(events, { fromBlock: 0, toBlock: 'latest', filter: { ...filter } }, function (error: any, event: any) {
      if (event instanceof Array) {
        reslove({ data: event, error: null })
      } else {
        console.log('events', events)
        console.log('error', error)
        reslove({ data: [], error })
      }
    })
  })
}

export const readGetApiEvents = (obj: ArrRequestType) =>
  request(`${obj.apiUrl}?module=logs&action=getLogs&fromBlock=0&address=${obj.address}&topic0=${obj.topic0}&apikey=${obj.apiKey}`)

export const GetIPFSJson = async (uri: string) => {
  try {
    let length = uri.indexOf(':')
    let str = uri.substring(0, length)
    let axiosData = {}
    if (str === 'http' || str === 'https') {
      // let res = await axios.get('https://api.raid.party/metadata/fighter/1')
      let res = await axios.get(uri)
      if (res && res.status === 200 && res.data) axiosData = res.data
    }
    return { axiosData }
  } catch (error) {
    console.log('error', error)
    return { axiosData: {} }
  }
}

export const GetWeb3StorageJsonOne = async (cid: string, isTheme?: boolean) => {
  try {
    let axiosDataFetch = await axios.get(`https://api.web3.storage/car/${cid}`, {
      headers: {
        'Content-Type': 'application/vnd.ipld.car',
        Authorizations: `Bearer ${(process.env as any).REACT_APP_LICENSE}`,
      },
      timeout: 500,
    })
    let json = axiosDataFetch.data.substr(axiosDataFetch.data.indexOf(`{"name`), axiosDataFetch.data.length)
    let axiosData: any = isJson(json) ? await JSON.parse(json) : !isTheme ? Default_data : Default_data_theme

    return { axiosData }
  } catch (error) {
    return { axiosData: !isTheme ? Default_data : Default_data_theme }
  }
}

export const GetWeb3StorageJsonTwo = async (cid: string, retrieveFiles: any, client: any) => {
  try {
    let axiosDataFetch = await axios.get(`https://api.web3.storage/car/${cid}`, {
      headers: {
        'Content-Type': 'application/vnd.ipld.car',
        Authorizations: `Bearer ${(process.env as any).REACT_APP_LICENSE}`,
      },
      timeout: 500,
    })
    let json = axiosDataFetch.data.substr(axiosDataFetch.data.indexOf(`{"name`), axiosDataFetch.data.length)
    let axiosData: any = isJson(json) ? await JSON.parse(json) : Default_data

    let navThemeCid = getIpfsHashFromBytes32(axiosData.categoriesName)
    let navThemeCidV1 = new CID(navThemeCid).toV1().toString('base32')
    let axiosDataThemeFetch = await axios.get(`https://api.web3.storage/car/${navThemeCidV1}`, {
      headers: {
        'Content-Type': 'application/vnd.ipld.car',
        Authorizations: `Bearer ${(process.env as any).REACT_APP_LICENSE}`,
      },
      timeout: 500,
    })
    let json1 = axiosDataThemeFetch.data.substr(axiosDataThemeFetch.data.indexOf(`{"name`), axiosDataThemeFetch.data.length)
    let axiosDataTheme = isJson(json1) ? await JSON.parse(json1) : Default_data_theme

    return { axiosData, axiosDataTheme }
  } catch (error) {
    return { axiosData: Default_data, axiosDataTheme: Default_data_theme }
  }
}

export const blockToTimestamp = async (web3: Web3, str: string) => {
  let data = await (await web3.eth.getBlock(str)).timestamp
  return moment.unix(data as any).format('YYYY-MM-DD HH:mm:ss')
}

export const getWeb3StorageLocal = async (client: any, network: any, dispatch: any) => {
  let localLength = localStorage.getItem('web3storage_number') || '0'
  let localWeb3StorageList = []
  for (let i = 0; i < Number(localLength); i++) {
    let obj: any = localStorage.getItem(`web3storage_list_${i}`)
    let listObj = JSON.parse(obj)
    localWeb3StorageList.push(...listObj)
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
    let index = 0 // 定义初始索引
    let resIndex = 0 // 用来保存每次拆分的长度
    const result = []
    while (index < arrNum) {
      result[index] = arr.slice(resIndex, size + resIndex)
      resIndex += size
      index++
    }
    return result
  }

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
  }

  getList(localWeb3StorageList)
}
