import React, { memo } from 'react'
import { TopBarWrapper } from './styled'
import { Row, Col, Image } from 'antd'
import { Link } from 'react-router-dom'
import LOGO from '@/assets/logo.png'
import SideMenu from '@/components/SideMenu'
import ConnectWallet from '@/components/ConnectWallet'
import { AdaptFontSize } from '@/utils'
import { useWindowSizeHooks } from '@/hooks/useWindowSizeHooks'
import SideMenuH5 from '@/components/SideMenuH5'
import SelectNetWork from '@/components/SelectNetWork'

interface Type {
  background?: string
  borderBottom?: string
}

export default memo(function TopBarPages(props: Type) {
  const { background = '#fff', borderBottom = '1px solid #E5E5E5' } = props
  const { windowSize } = useWindowSizeHooks()

  return (
    <TopBarWrapper style={{ background, borderBottom }}>
      <Row style={{ width: '100%' }} gutter={20}>
        <Col span={12} lg={{ span: 4 }} xl={{ span: 4 }} className="tabbar-left">
          <Link to="/home">
            <Image src={LOGO} className="logo" preview={false} />
          </Link>
        </Col>
        {windowSize.innerWidth > AdaptFontSize && (
          <Col lg={{ span: 12 }} xl={{ span: 12 }} span={0} className="tabbar-center">
            <SideMenu />
          </Col>
        )}
        <Col span={12} lg={{ span: 8 }} xl={{ span: 8 }} className="tabbar-right">
          {windowSize.innerWidth <= AdaptFontSize && <SideMenuH5 />}
          <ConnectWallet />
          <SelectNetWork />
        </Col>
      </Row>
    </TopBarWrapper>
  )
})
