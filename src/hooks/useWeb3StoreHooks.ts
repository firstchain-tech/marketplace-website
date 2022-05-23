import { useContext } from 'react'
import type { StorageClientTypes } from '@/contracts/web3StorageInit'
import { Context } from '@/components/Web3Provider'

const useWeb3StoreHooks = () => {
  const { web3Store }: { web3Store: StorageClientTypes } = useContext<any>(Context)
  return web3Store
}

export default useWeb3StoreHooks
