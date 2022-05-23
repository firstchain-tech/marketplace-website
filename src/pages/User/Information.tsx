import React, { memo, useEffect } from 'react'
import { Row, Col } from 'antd'
import { UserHomeWrapper, UserHomeTitle, Title, ContentTitle, ContentLi } from './InformationStyled'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatStrAddress } from '@/utils'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import { WalletOutlined } from '@ant-design/icons'
import { ComLayoutTwo } from '@/common/styled'

export default memo(function UserHomePage() {
  const { t } = useTranslation()
  const context = useWeb3React<Web3Provider>()
  const { active } = context

  const myAddress = useSelector((state: any) => state.userInfo.address)

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UserHomeWrapper>
      <UserHomeTitle>
        <Title>
          <Link to={'/information'}>{t('myhome.title')}</Link>
        </Title>
      </UserHomeTitle>
      <ComLayoutTwo>
        <Row className="details-home content-home">
          <Col className="details-home-content">
            <div className="content-white">
              <ContentTitle>{t('myhome.user.title')}</ContentTitle>
              <Row>
                <Col span={24}>
                  <div className="top-right">
                    <WalletOutlined />
                    <span style={{ marginLeft: '1.25rem', marginRight: '0.63rem' }}>{t('myhome.vice.title1.link')}</span>
                    {active && <span style={{ color: '#363639' }}>{formatStrAddress(6, 4, myAddress)}</span>} {!active && <span>-</span>}
                  </div>
                </Col>
              </Row>
            </div>
            <div className="content-white" style={{ paddingBottom: '1.25rem' }}>
              <ContentTitle style={{ borderBottom: 'none' }}>{t('myhome.vice.title2')}</ContentTitle>
              <ul>
                <li>
                  {t('myhome.vice.title2.list1')}
                  <ContentLi>
                    <span>{t('myhome.vice.title2.list1.1')}</span>
                    <span>{t('myhome.vice.title2.list1.2')}</span>
                    <span>{t('myhome.vice.title2.list1.3')}</span>
                  </ContentLi>
                </li>
                <li>{t('myhome.vice.title2.list2')}</li>
                <li>{t('myhome.vice.title2.list3')}</li>
              </ul>
            </div>
          </Col>
        </Row>
      </ComLayoutTwo>
    </UserHomeWrapper>
  )
})
