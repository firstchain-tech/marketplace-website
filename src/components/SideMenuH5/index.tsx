import React, { memo, useState } from 'react'
import { SideMenuWrapper, StyledNavLink } from './styled'
import { Drawer, Row, Col, Image } from 'antd'
import LOGO from '@/assets/logo.png'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { setListInfoSwitch } from '@/common/init'
import type { MenuListType as ListType } from '@/common/data.d'
import { Link } from 'react-router-dom'

export default memo(function SideMenuH5Page() {
  const { i18n } = useTranslation()
  const [isMenuShow, setIsMenuShow] = useState(false)

  const [{ list }] = useState<{ list: ListType[] }>(() => {
    let { list } = setListInfoSwitch()
    return { list }
  })

  const oddEvent = (match: any, location: any, item: any) => {
    if (!match || item.url === '') {
      return false
    }
    const hash = location.hash
    const itemHash = `#${item.url.substring(item.url.lastIndexOf('#') + 1, item.url.length)}`
    if (hash === itemHash) return true
    else return false
  }

  return (
    <SideMenuWrapper>
      {!isMenuShow && <MenuOutlined className="iconss" onClick={() => setIsMenuShow(true)} />}
      {isMenuShow && <CloseOutlined className="iconss" onClick={() => setIsMenuShow(false)} />}
      <Drawer
        className="h5-drawer"
        closable={false}
        placement="top"
        height={'80%'}
        onClose={() => setIsMenuShow(false)}
        visible={isMenuShow}
      >
        <Row style={{ width: '100%', height: '5.5rem', display: 'flex', justifyContent: 'center', alignContent: 'center' }} gutter={20}>
          <Col span={12} lg={{ span: 6 }} className="tabbar-left">
            <Link to="/home">
              <Image src={LOGO} className="logo" preview={false} width="10.06rem" />
            </Link>
          </Col>
          <Col span={12} lg={{ span: 6 }} className="tabbar-right">
            <CloseOutlined className="iconss" style={{ color: '#5f6469' }} onClick={() => setIsMenuShow(false)} />
          </Col>
        </Row>
        <div className="h5-menu-drawer-navlink">
          {list.map((item) => {
            if (item.enName === 'About') {
              return (
                <StyledNavLink
                  key={item.key}
                  to={item.url === '' ? {} : item.url}
                  isActive={(match, location) => oddEvent(match, location, item)}
                  onClick={() => setIsMenuShow(false)}
                >
                  <div className="navlink-child-title">{i18n.language === 'en' ? item.enName : item.name}</div>
                </StyledNavLink>
              )
            } else
              return (
                <StyledNavLink to={item.url === '' ? {} : item.url} key={item.key} onClick={() => setIsMenuShow(false)}>
                  <div className="navlink-child-title">{i18n.language === 'en' ? item.enName : item.name}</div>
                </StyledNavLink>
              )
          })}
        </div>
      </Drawer>
    </SideMenuWrapper>
  )
})
