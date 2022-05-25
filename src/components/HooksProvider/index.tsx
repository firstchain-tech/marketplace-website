import { useChainIdHooks } from '@/hooks/useChainIdHooks'
import { useWindowSizeHooks } from '@/hooks/useWindowSizeHooks'
import { AdaptFontSize } from '@/utils'
import { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { useWeb3StorageLocalHooks } from '@/hooks/useWeb3StorageLocalHooks'
import { LayoutWrapper, LayoutContent } from '@/layout/styled'
import TopBar from '@/components/TopBar'
import Footer from '@/components/Footer'
import { useSelector } from 'react-redux'

const HooksProviderPage = ({ children }: any) => {
  useChainIdHooks()

  const isRefreshData = useSelector((state: any) => state.walletInfo.loading)
  const { loading } = useWeb3StorageLocalHooks({ isRefreshData })

  const { windowSize } = useWindowSizeHooks()
  const [isStyleSuccess, setIsStyleSuccess] = useState(false)
  const [isH5Web, setIsH5Web] = useState<'h5' | 'web'>('web')

  useEffect(() => {
    if (windowSize.innerWidth < AdaptFontSize) setIsH5Web('h5')
    if (windowSize.innerWidth >= AdaptFontSize) setIsH5Web('web')
    if (isStyleSuccess) return
    if (windowSize.innerWidth < AdaptFontSize) {
      let fontSize =
        windowSize.innerWidth >= AdaptFontSize
          ? '100%'
          : `${(windowSize.innerWidth / AdaptFontSize) * 100 > 63 ? (windowSize.innerWidth / AdaptFontSize) * 100 : 62.5}%`
      document.documentElement.style.fontSize = fontSize
      setIsStyleSuccess(true)
    } else {
      document.documentElement.style.fontSize = '100%'
      setIsStyleSuccess(true)
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSize.innerWidth])

  useEffect(() => {
    setIsStyleSuccess(false)
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isH5Web])

  return (
    <Spin spinning={loading} className="antd-loadings" tip="Loading..." wrapperClassName="global-span">
      {!loading ? (
        children
      ) : (
        <LayoutWrapper>
          <TopBar />
          <LayoutContent></LayoutContent>
          <Footer />
        </LayoutWrapper>
      )}
    </Spin>
  )
}

export default HooksProviderPage
