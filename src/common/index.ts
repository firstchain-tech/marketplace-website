import Web3 from 'web3'
import axios from 'axios'
import moment from 'moment'
import bs58 from 'bs58'
import type { ArrRequestType } from '@/common/data.d'
import request from '@/utils/request'

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

export const GetWeb3StorageJsonOne = async (cid: string) => {
  let axiosDataFetch = await axios.get(`https://api.web3.storage/car/${cid}`)
  let json = axiosDataFetch.data.substr(axiosDataFetch.data.indexOf(`{"name`), axiosDataFetch.data.length)
  let axiosData: any = await JSON.parse(json)

  // let axiosDataFetch: any = await fetch(`https://ipfs.io/ipfs/${cid}/qqnft.json`)
  // let axiosData: any = await axiosDataFetch.json()

  return { axiosData }
}

export const GetWeb3StorageJsonTwo = async (cid: string, retrieveFiles: any, client: any) => {
  let axiosDataFetch = await axios.get(`https://api.web3.storage/car/${cid}`)
  let json = axiosDataFetch.data.substr(axiosDataFetch.data.indexOf(`{"`), axiosDataFetch.data.length)
  let axiosData: any = await JSON.parse(json)
  let navThemeCid = getIpfsHashFromBytes32(axiosData.categoriesName)
  let axiosDataThemeFetch = await axios.get(`https://api.web3.storage/car/${navThemeCid}`)
  let json1 = axiosDataThemeFetch.data.substr(axiosDataThemeFetch.data.indexOf(`{"name`), axiosDataThemeFetch.data.length)
  let axiosDataTheme = await JSON.parse(json1)

  // let axiosDataFetch: any = await fetch(`https://ipfs.io/ipfs/${cid}/${await retrieveFiles(client, cid)}`)
  // let axiosData: any = await axiosDataFetch.json()
  // let navThemeCid = getIpfsHashFromBytes32(axiosData.categoriesName)
  // let axiosDataThemeFetch: any = await fetch(`https://ipfs.io/ipfs/${navThemeCid}/${await retrieveFiles(client, navThemeCid)}`)
  // let axiosDataTheme: any = await axiosDataThemeFetch.json()
  return { axiosData, axiosDataTheme }
}

export const blockToTimestamp = async (web3: Web3, str: string) => {
  let data = await (await web3.eth.getBlock(str)).timestamp
  return moment.unix(data as any).format('YYYY-MM-DD HH:mm:ss')
}
