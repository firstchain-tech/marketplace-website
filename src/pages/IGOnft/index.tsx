/* eslint-disable */
import React, { memo, useState, useEffect, useRef } from 'react'
import { IGOnftWrapper, IGOnftTitle, Title, IGOnftContent, ContentList } from './styled'
import { DescribeDiv } from '@/pages/Market/styled'
import { Link } from 'react-router-dom'
import { Col, Image, Row, Spin, message, Button, Modal, Divider } from 'antd'
import { useIGOnftHooks } from '@/hooks/useIGOnftHooks'
import type { ListType } from '@/hooks/useIGOnftHooks'
import { ImageError } from '@/common/init'
import { ComLayoutTwo } from '@/common/styled'
import NoData from '@/components/NoData'
import { useHistory } from 'react-router-dom'
import { LeftCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const currentDetailsInit: ListType = {
  img: '',
  name: '',
  content: [],
  title: '',
  serialNumber: '',
  icon: '',
}

export default memo(function IGOnftPage(props: any) {
  const { t } = useTranslation()
  let history = useHistory()
  const modalRef = useRef<any>(null)

  const [currentStatus, setCurrentStatus] = useState<'list' | 'details'>('list')
  const [currentDetails, setCurrentDetails] = useState<ListType>(currentDetailsInit)
  const [onApplyShow, setOnApplyShow] = useState(false)

  const { loading, listData } = useIGOnftHooks()
  const { igoDefaultEmail } = useSelector((state: any) => state.infoInfo)

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  useEffect(() => {
    const search = props.location.search
    historySearchSwitch(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, listData])

  const historySearchSwitch = (search: any) => {
    if (search && listData.length !== 0) {
      let listSearch = search.slice(1).split('&')
      let list: { lable: string; value: any }[] = []
      listSearch.forEach((element: any) => {
        let objs = element.split('=')
        list.push({
          lable: objs[0],
          value: objs[1],
        })
      })
      if (list[0].lable === 'key' && list[0].value) {
        let data = listData.filter((item) => item.serialNumber === list[0].value)
        if (data.length === 0) {
          message.error({
            content: t('igonft.message.tips'),
            className: 'message-global',
          })
          setTimeout(() => {
            history.replace('/igonft')
          }, 500)
          return false
        }
        setCurrentStatus('details')
        setCurrentDetails(data[0])
      }
    } else {
      setCurrentStatus('list')
    }
  }

  const copyEmail = async () => {
    let aux = document.createElement('input')
    aux.setAttribute('value', igoDefaultEmail)
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
    message.success({
      content: t('igonft.apply.copy.success'),
      className: 'message-global',
    })
    setOnApplyShow(false)
  }

  return (
    <IGOnftWrapper ref={modalRef}>
      {currentStatus === 'list' && (
        <>
          <IGOnftTitle>
            <Title>
              <Link to={'/igonft'}>{t('igonft.title')}</Link>
            </Title>
          </IGOnftTitle>
          <IGOnftContent>
            <h3>{t('igonft.title.h3')}</h3>
            <h5>{t('igonft.title.h5')}</h5>
            <ComLayoutTwo className="igonft-two">
              <ContentList gutter={{ xs: 12, sm: 24, lg: 80 }}>
                {!loading &&
                  listData.length > 0 &&
                  listData.map((item, i) => (
                    <Col key={i} span={24} md={12} onClick={() => history.replace(`/igonft?key=${item.serialNumber}`)}>
                      <Row className="ant-cols">
                        <Col span={12}>
                          <Image src={item.icon} preview={false} fallback={ImageError}></Image>
                        </Col>
                        <Col span={12}>
                          <div className="right">
                            <span>{item.name}</span>
                            <p>{item.title}</p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                {loading && (
                  <div className="loadings">
                    <Spin tip="Loading..." />
                  </div>
                )}
                {!loading && listData.length === 0 && <NoData top={0} />}
              </ContentList>
            </ComLayoutTwo>
            <Row>
              <Col span={24} className="igo-btn">
                <Button className="my-home-btn-1 details-btns" onClick={() => setOnApplyShow(true)}>
                  {t('igonft.apply.btn')}
                </Button>
              </Col>
            </Row>
          </IGOnftContent>
        </>
      )}
      {currentStatus === 'details' && (
        <>
          <IGOnftTitle>
            <Title>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCurrentStatus('list')
                  setCurrentDetails(currentDetailsInit)
                  history.replace('/igonft')
                }}
              >
                <LeftCircleOutlined style={{ color: '#5746FE' }} />
              </div>
            </Title>
          </IGOnftTitle>
          <Row gutter={{ xs: 12, sm: 24, lg: 68 }} className="details-igonft">
            <Col span={24} className="details-igonft-left">
              <Image src={currentDetails.img} preview={false} fallback={ImageError} />
            </Col>
            <Col span={24} className="details-igonft-right">
              <DescribeDiv style={{ paddingBottom: '2.25rem' }}>
                <Row>
                  <Col span={24} md={{ span: 18 }}>
                    <h2>{currentDetails.name}</h2>
                    <h4>{currentDetails.title}</h4>
                  </Col>
                  <Col span={24} md={{ span: 6 }} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button className="my-home-btn-1 details-btns" onClick={() => history.replace('/market')}>
                      {t('igonft.details.btn')}
                    </Button>
                  </Col>
                </Row>
              </DescribeDiv>
            </Col>
            <Col span={24}>
              <DescribeDiv>
                <h3>{t('igonft.details.introduce.title')}</h3>
                <ul>
                  {currentDetails.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </DescribeDiv>
            </Col>
          </Row>
        </>
      )}
      <Modal
        visible={onApplyShow}
        style={{ borderRadius: '0.63rem' }}
        footer={null}
        onCancel={() => setOnApplyShow(false)}
        width="36.88rem"
        centered
        getContainer={modalRef.current}
        wrapClassName="wallets"
      >
        <h2>{t('igonft.apply.title')}</h2>
        <Divider plain dashed className="gray"></Divider>
        <Row className="igo-modal">
          <Col span={24}>
            <p>{t('igonft.apply.p1')}</p>
            <p>{t('igonft.apply.p2')}</p>
          </Col>
          <Col span={24}>
            <p>
              {t('igonft.apply.email')} <span>{igoDefaultEmail}</span>
            </p>
          </Col>
          <Col span={24}>
            <Button type="primary" onClick={() => copyEmail()}>
              {t('igonft.apply.copy.btn')}
            </Button>
          </Col>
        </Row>
      </Modal>
    </IGOnftWrapper>
  )
})
/* eslint-disable */
