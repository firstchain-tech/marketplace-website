import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import CID from 'cids'
import Mock from 'mockjs'

export interface StorageClientTypes {
  client: typeof Web3Storage
  storeFilesPapers: (file: any, client: any, type: string) => void
  makeFileObjects: (obj: object) => void
}

class StorageClient {
  client: typeof Web3Storage
  constructor(token: string) {
    this.client = new Web3Storage({ token })
  }

  async storeFilesPapers(file: any, client: any, type: string) {
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Mock.mock('@natural')}.${ext}`
      const newFile = new File([file], fileName, { type })
      const s = await client.put([newFile], { name: fileName })
      let cid = new CID(s).toV0().toString('base58btc')
      /**
       * `https://${cid}.ipfs.dweb.link/${file.name}` v1
       * `https://ipfs.io/ipfs/${cid}/${file.name}` v0
       */
      return { cid, url: `https://ipfs.io/ipfs/${cid}/${fileName}` }
    } catch (error) {
      console.log('error', error)
    }
  }

  makeFileObjects(obj: object) {
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
    const files = new File([blob], 'qqnft.json')
    return files
  }
}
export default StorageClient
