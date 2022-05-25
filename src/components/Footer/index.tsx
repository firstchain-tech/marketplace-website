import React, { memo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Row, Col, Image } from 'antd'
import { useTranslation } from 'react-i18next'
import { NavLink, Link } from 'react-router-dom'
import LOGO from '@/assets/logo_footer.png'
import { FOOTER_1, FOOTER_2 } from './icon'
import { setListInfoSwitch } from '@/common/init'
import type { MenuListType as ListType } from '@/common/data.d'

const FooterWrapper = styled.div`
  padding: 0 6.25rem;
  height: 12.5rem;
  background: ${(props) => props.theme.themeColor};
  .ant-row {
    align-items: center;
    height: 100%;
  }
  .footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .logo {
    width: 10.06rem;
    height: auto;
    margin-bottom: 3rem;
  }
  ${(props) =>
    props.theme.mediaWidth.screenLg(
      () => css`
        padding: 0 1.13rem;
        .logo {
          margin-bottom: 1.38rem;
        }
      `,
    )}
`

const FooterTitle = styled.div`
  font-size: 0.88rem;
  font-weight: 500;
  color: #fff;
  line-height: 1.56rem;
  margin-top: 3rem;
  ${(props) =>
    props.theme.mediaWidth.screenLg(
      () => css`
        margin-top: 3rem;
      `,
    )}
`

const FooterIcon = styled.div`
  .ant-image {
    &:nth-child(1) {
      margin-right: 2.5rem;
    }
  }
`

const MenuList = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const activeClassName = 'ACTIVE'
export const StyledNavLink = styled(NavLink).attrs({ activeClassName })`
  font-size: 0.88rem;
  font-weight: 400;
  color: #eeeeee;
  line-height: 1.56rem;
  text-align: center;
  margin-right: 3.13rem;
  &.${activeClassName} {
    font-weight: 600;
    color: #fff !important;
  }
  &:hover {
    content: none;
    font-weight: 600;
    color: #fff;
  }
  ${(props) =>
    props.theme.mediaWidth.screenLg(
      () => css`
        line-height: 2.56rem;
      `,
    )}
`

interface Types {
  className?: any | string
}

export default memo(function FooterPages(props: Types) {
  const { className } = props
  const { t, i18n } = useTranslation()
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
    <FooterWrapper className={className}>
      <Row>
        <Col span={16} md={{ span: 20 }} className="left">
          <Link to="/home">
            <Image src={LOGO} className="logo" preview={false} />
          </Link>
          <MenuList>
            {list.map((item) => {
              if (item.enName === 'About') {
                return (
                  <StyledNavLink
                    key={item.key}
                    to={item.url === '' ? {} : item.url}
                    isActive={(match, location) => oddEvent(match, location, item)}
                  >
                    <div className="navlink-child-title">{i18n.language === 'en' ? item.enName : item.name}</div>
                  </StyledNavLink>
                )
              } else
                return (
                  <StyledNavLink to={item.url === '' ? {} : item.url} key={item.key}>
                    <div className="navlink-child-title">{i18n.language === 'en' ? item.enName : item.name}</div>
                  </StyledNavLink>
                )
            })}
          </MenuList>
        </Col>
        <Col span={8} md={{ span: 4 }} className="footer-right">
          <FooterIcon>
            <a href="https://twitter.com/collexclub" target="_blank" rel="noreferrer">
              <Image preview={false} src={FOOTER_1} width="1.88rem" height="1.56rem" />
            </a>
            <Image preview={false} src={FOOTER_2} width="1.88rem" height="1.38rem" />
          </FooterIcon>
          <FooterTitle>{t('app.footer.copyright')}</FooterTitle>
        </Col>
      </Row>
    </FooterWrapper>
  )
})
