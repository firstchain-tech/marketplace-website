import React, { memo, useState } from 'react'
import { StyledNavLink } from './styled'
import { Menu } from 'antd'
import { useTranslation } from 'react-i18next'
import { setListInfoSwitch } from '@/common/init'
import type { MenuListType as ListType } from '@/common/data.d'

export default memo(function SideMenuPages() {
  const { i18n } = useTranslation()
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
    <Menu mode="horizontal" style={styleMenu}>
      {list.map((item) => (
        <Menu.Item key={item.key} className="menuItemCus">
          {item.enName === 'About' ? (
            <StyledNavLink to={item.url === '' ? {} : item.url} isActive={(match, location) => oddEvent(match, location, item)}>
              <div className="navlink-child-title">{i18n.language === 'en' ? item.enName : item.name}</div>
            </StyledNavLink>
          ) : (
            <StyledNavLink to={item.url === '' ? {} : item.url}>
              <div className="navlink-child-title">{i18n.language === 'en' ? item.enName : item.name}</div>
            </StyledNavLink>
          )}
        </Menu.Item>
      ))}
    </Menu>
  )
})

const styleMenu = {
  width: '100%',
  background: 'transparent',
  borderBottom: 'none',
  display: 'flex',
  justifyContent: 'flex-end',
}
