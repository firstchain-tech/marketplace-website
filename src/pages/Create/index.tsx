import React, { memo, useEffect } from 'react'
import { CreateWrapper, CreateWalletWrapper } from './styled'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import ConnectWallet from '@/components/ConnectWallet'
import CreateOrEdit from '@/components/CreateModal'

export default memo(function CreatePage() {
  const context = useWeb3React<Web3Provider>()
  const { active } = context

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CreateWrapper>
      {active && <CreateOrEdit />}
      {!active && (
        <CreateWalletWrapper>
          <ConnectWallet status="create" />
        </CreateWalletWrapper>
      )}
    </CreateWrapper>
  )
})
