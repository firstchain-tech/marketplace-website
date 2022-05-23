import React, { memo, useState, useEffect } from 'react'
import {
  MyProjectWrapper,
  MyProjectTitle,
  Title,
  ImageDiv,
  MyProjectList,
  ListInfo,
  TitleMin,
  MyProjectTitle1,
  MyProjectCurrent,
} from './MyProjectStyled'
import { Link } from 'react-router-dom'
import { Button, Image, message, Row, Col, Divider, Modal, Form, Input, Spin, Pagination } from 'antd'
import { useMyProjectHooks } from '@/hooks/useMyProjectHooks'
import type { ListType } from '@/hooks/useMyProjectHooks'
import type { CardType } from '@/common/data'
import { ImageError } from '@/common/init'
import { LeftCircleOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TitleTrue, Title as Titles } from '@/components/CreateModal/styled'
import Card from '@/components/Card'
import CreateProgram from '@/components/CreateProgram'
import CreateDetailsModal from '@/components/CreateDetailsModal'
import CreateProject from '@/components/CreateProject'
import { useCreateHooks } from '@/hooks/useCreateHooks'
import { useSelector } from 'react-redux'
import NoData from '@/components/NoData'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { useFeeUpdatedHooks } from '@/hooks/useFeeUpdatedHooks'

// const { Option } = Select

const currentDetailsInit: ListType = {
  serialNumber: '',
  img: '',
  name: '',
  number: 0,
  list: [],
  blockNumber: undefined,
  value: '',
}

const currentDetailsInit1: CardType = {
  tokenId: '',
  name: '',
  image: '',
  serialNumber: 0,
}

export default memo(function MyProjectPage(props: any) {
  const { REACT_APP_ENV = 'prd' } = process.env

  let history = useHistory()
  const { t } = useTranslation()
  const nftData: ConstantInitTypes = useDataHooks()
  const { myNftPageSize, payTokenOptions } = nftData

  const [onShow, setOnShow] = useState(false)
  const [currentDetails, setCurrentDetails] = useState<ListType>(currentDetailsInit)
  const [currentDetails1, setCurrentDetails1] = useState<CardType>(currentDetailsInit1)
  const [currentStatus, setCurrentStatus] = useState<'projectList' | 'detailsList' | 'import' | 'details'>('projectList')

  const [onShowCreate, setOnShowCreate] = useState(false)
  const [onShowCreateTwo, setOnShowCreateTwo] = useState(false)
  const [isRefreshData, setIsRefreshData] = useState(false)
  const myAddress = useSelector((state: any) => state.userInfo.address)

  const { portfolioList } = useCreateHooks({ myAddress, isRefreshData })
  const { myProjectList, loading } = useMyProjectHooks({ portfolioList, myAddress })
  const { serviceCharge } = useFeeUpdatedHooks()

  const [current, setCurent] = useState(1)

  useEffect(() => {
    const search = props.location.search
    historySearchSwitch(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, myProjectList])

  useEffect(() => {
    console.log('currentStatus', currentStatus)
  }, [currentStatus])

  const historySearchSwitch = (search: any) => {
    if (search) {
      let listSearch = search.slice(1).split('&')
      let list: { lable: string; value: any }[] = []
      listSearch.forEach((element: any) => {
        let objs = element.split('=')
        list.push({
          lable: objs[0],
          value: objs[1],
        })
      })
      if (list[0].lable === 'project' && list[0].value && list[1].value && list[1].lable === 'r' && myProjectList.length !== 0) {
        let listArr: CardType[] = []
        myProjectList.forEach((item) => {
          listArr.push(...item.list)
        })
        let data = listArr.filter((item) => item.tokenId === list[0].value)
        let dataOne = myProjectList.filter((item) => item.serialNumber === list[1].value)
        if (data.length === 0 || dataOne.length === 0) {
          message.error({
            content: t('myproject.message.tips'),
            className: 'message-global',
          })
          setTimeout(() => {
            history.replace('/myproject')
          }, 500)
          return false
        }
        setCurrentStatus('details')
        setCurrentDetails1(data[0])
        setCurrentDetails(dataOne[0])
      } else if (
        list[0].lable === 'key' &&
        list[0].value &&
        list[0].value !== 'import' &&
        list[0].value !== 'create' &&
        myProjectList.length !== 0
      ) {
        let data = myProjectList.filter((item) => item.serialNumber === list[0].value && item.list.length !== 0)
        if (data.length === 0) {
          message.error({
            content: t('myproject.message.tips'),
            className: 'message-global',
          })
          setTimeout(() => {
            history.replace('/myproject')
          }, 500)
          return false
        }
        setCurrentStatus('detailsList')
        setCurrentDetails(data[0])
      } else if (list[0].lable === 'key' && list[0].value && list[0].value === 'import') {
        setCurrentStatus('import')
      } else {
        setCurrentStatus('projectList')
      }
    } else {
      setCurrentStatus('projectList')
    }
  }

  const paginationChange = (page: any, pageSize: any) => setCurent(page)

  const onFinishImport = (values: any) => {}

  return (
    <MyProjectWrapper>
      {currentStatus === 'projectList' && (
        <>
          <MyProjectTitle1>
            <Title className="title">
              <Link to={'/myproject'}>{t('myproject.title')}</Link>
            </Title>
            <div className="title-right">
              <Button className="import-btn" onClick={() => history.replace(`/myproject?key=import`)}>
                {t('myproject.right.btn1')}
              </Button>
              <Button type="primary" className="create-btn" onClick={() => setOnShowCreate(true)}>
                {t('myproject.right.btn2')}
              </Button>
            </div>
          </MyProjectTitle1>
          <MyProjectList>
            {!loading && (
              <>
                {myProjectList.length > 0 && (
                  <>
                    {myProjectList.map((item, index) => (
                      <div key={index} className="content-nft-info">
                        <ListInfo
                          onClick={() => {
                            if (item.list.length > 0) history.replace(`/myproject?key=${item.serialNumber}`)
                            else
                              message.info({
                                content: t('myproject.message.tips1'),
                                className: 'message-global',
                              })
                          }}
                        >
                          <ImageDiv>
                            <Image src={item.img} className="card-img" preview={false} fallback={ImageError} />
                          </ImageDiv>
                          <span>{item.name}</span>
                          <h5>
                            {item.number}
                            {t('myproject.list.uint')}
                          </h5>
                        </ListInfo>
                      </div>
                    ))}
                  </>
                )}
                {myProjectList.length === 0 && <NoData top={0} />}
              </>
            )}
            {loading && (
              <div className="loadings">
                <Spin tip="Loading..." />
              </div>
            )}
          </MyProjectList>
        </>
      )}
      {currentStatus === 'detailsList' && (
        <>
          <MyProjectTitle>
            <Title>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCurrentStatus('projectList')
                  setCurrentDetails(currentDetailsInit)
                  history.replace('/myproject')
                }}
              >
                <LeftCircleOutlined style={{ color: '#5746FE' }} />
              </div>
            </Title>
          </MyProjectTitle>
          <TitleMin>
            <div className="left">
              <span style={{ marginRight: '0.63rem' }}>{t('myproject.list.title1')}</span>
              <p>{currentDetails.name}</p>
              <span style={{ marginRight: '0.63rem' }}>{t('myproject.list.title2')}</span>
              <p className="theme">{currentDetails.number}</p>
            </div>
            <div className="right">
              <Button type="primary" className="create-btn" onClick={() => setOnShowCreateTwo(true)}>
                {t('myproject.right.btn3')}
              </Button>
            </div>
          </TitleMin>
          <MyProjectList>
            {currentDetails.list
              .filter((item, i) => i < current * (myNftPageSize || 16) && i >= (current - 1) * (myNftPageSize || 16))
              .map((item, index) => (
                <div key={index} className="content-nft-info">
                  <Card
                    details={item}
                    keys="myproject"
                    returnBuyClcik={(s) => {}}
                    returnClick={(s) => history.replace(`/myproject?project=${s.tokenId}&r=${currentDetails.serialNumber}`)}
                    returnRefreshData={() => {
                      setIsRefreshData(!isRefreshData)
                    }}
                    serviceCharge={serviceCharge}
                  />
                </div>
              ))}
          </MyProjectList>
          <MyProjectCurrent>
            {currentDetails.list.length > 0 && (
              <Pagination
                showTitle={false}
                defaultCurrent={current}
                current={current}
                defaultPageSize={myNftPageSize || 16}
                total={currentDetails.list.length}
                showSizeChanger={false}
                onChange={paginationChange}
              />
            )}
          </MyProjectCurrent>
        </>
      )}
      {currentStatus === 'import' && (
        <>
          <MyProjectTitle>
            <Title>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCurrentStatus('projectList')
                  history.replace('/myproject')
                }}
              >
                <LeftCircleOutlined style={{ color: '#5746FE' }} />
              </div>
            </Title>
          </MyProjectTitle>
          <Row>
            <Col span={3} lg={{ span: 6 }}></Col>
            <Col span={18} lg={{ span: 12 }}>
              <Titles>{t('myproject.import.title')}</Titles>
              <TitleTrue style={{ marginBottom: '2.5rem' }}>{t('myproject.import.f1')}</TitleTrue>
              <Row>
                {REACT_APP_ENV === 'prd' && (
                  <Col span={24} xl={12}>
                    <Button
                      type="primary"
                      className="create-btn-1"
                      onClick={() => {
                        message.info({
                          content: t('home.open.tips'),
                          className: 'message-global',
                        })
                      }}
                    >
                      <span>{t('myproject.import.list1.span')}</span>
                      <div className="p">{t('myproject.import.list1.p')}</div>
                    </Button>
                  </Col>
                )}
                {REACT_APP_ENV !== 'prd' && (
                  <Col span={24} xl={12}>
                    <Button
                      className="create-btn-2"
                      onClick={() => {
                        message.info({
                          content: t('home.open.tips'),
                          className: 'message-global',
                        })
                      }}
                    >
                      <span>{t('myproject.import.list2.span')}</span>
                      <div className="p">{t('myproject.import.list2.p')}</div>
                    </Button>
                  </Col>
                )}
              </Row>
            </Col>
            <Col span={3} lg={{ span: 6 }}></Col>
          </Row>
        </>
      )}
      {currentStatus === 'details' && (
        <>
          <MyProjectTitle>
            <Title>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCurrentStatus('projectList')
                  history.replace(`/myproject?key=${currentDetails.serialNumber}`)
                }}
              >
                <LeftCircleOutlined style={{ color: '#5746FE' }} />
              </div>
            </Title>
          </MyProjectTitle>
          <CreateDetailsModal
            details={currentDetails1}
            returnRefreshData={() => {
              setIsRefreshData(!isRefreshData)
              history.replace(`/myproject?key=${currentDetails.serialNumber}`)
            }}
            serviceCharge={serviceCharge}
          />
        </>
      )}
      <Modal
        visible={onShow}
        style={{ borderRadius: '0.63rem' }}
        footer={null}
        onCancel={() => setOnShow(false)}
        width="36.88rem"
        wrapClassName="wallets"
        centered
      >
        <Titles>{t('myproject.import.modal.title')}</Titles>
        <TitleTrue>{t('myproject.import.modal.f1')}</TitleTrue>
        <Form onFinish={onFinishImport} initialValues={{ uint: payTokenOptions[0].label }}>
          <div style={{ display: 'flex' }}>
            {/* <Form.Item name="uint" rules={[{ required: true, message: 'Plate' }]}>
              <Select className="select-before" size="large">
                {payTokenOptions.map((item, index) => (
                  <Option value={item.label} key={index}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>  className="inputs"*/}
            <Form.Item name="address" rules={[{ required: true, message: t('myproject.import.modal.rules') }]} style={{ width: '100%' }}>
              <Input placeholder={t('myproject.import.modal.placeholder')} size="large"></Input>
            </Form.Item>
          </div>
          <Button className="my-home-btn-4" htmlType="submit" type="primary">
            {t('myproject.import.modal.btn')}
          </Button>
        </Form>
      </Modal>
      <Modal
        visible={onShowCreate}
        style={{ borderRadius: '0.63rem' }}
        footer={null}
        onCancel={() => setOnShowCreate(false)}
        width="36.88rem"
        wrapClassName="wallets"
        centered
        destroyOnClose
      >
        <h2>{t('myproject.create.title1')}</h2>
        <Divider plain dashed className="gray"></Divider>
        <CreateProgram
          returnClick={(s) => {
            setOnShowCreate(s)
            setIsRefreshData(!isRefreshData)
          }}
        />
      </Modal>
      <Modal
        visible={onShowCreateTwo}
        style={{ borderRadius: '0.63rem' }}
        footer={null}
        onCancel={() => setOnShowCreateTwo(false)}
        width="36.88rem"
        wrapClassName="wallets"
        centered
        destroyOnClose
      >
        <h2>{t('myproject.create.title2')}</h2>
        <Divider plain dashed className="gray"></Divider>
        <CreateProject
          returnClick={(s) => {
            setOnShowCreateTwo(s)
            setIsRefreshData(!isRefreshData)
          }}
          programDetails={currentDetails}
        />
      </Modal>
    </MyProjectWrapper>
  )
})
