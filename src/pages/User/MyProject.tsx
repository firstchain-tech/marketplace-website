import React, { memo, useState, useEffect, useRef } from 'react'
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
import { InboxOutlined } from '@ant-design/icons'
import { UploadCusDiv } from '@/components/CreateProgram/styled'
import { Link } from 'react-router-dom'
import { getBase64 } from '@/utils'
import { Button, Image, message, Row, Col, Divider, Modal, Form, Input, Spin, Pagination, Upload } from 'antd'
import { useMyProjectHooks } from '@/hooks/useMyProjectHooks'
import type { ListType } from '@/hooks/useMyProjectHooks'
import type { CardType } from '@/common/data'
import { ImageError } from '@/common/init'
import { LeftCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TitleTrue, Title as Titles } from '@/components/CreateModal/styled'
import Card from '@/components/Card'
import CreateProgram from '@/components/CreateProgram'
import CreateDetailsModal from '@/components/CreateDetailsModal'
import CreateProject from '@/components/CreateProject'
import { useSelector, useDispatch } from 'react-redux'
import NoData from '@/components/NoData'
import { MarketSharedToken_ABI } from '@/contracts/constant'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { useFeeUpdatedHooks } from '@/hooks/useFeeUpdatedHooks'
import { getWeb3StorageLocal, getBytes32FromIpfsHash } from '@/common'
import useWeb3StoreHooks from '@/hooks/useWeb3StoreHooks'
import type { StorageClientTypes } from '@/contracts/web3StorageInit'
import { FormInstance } from 'antd/es/form'

// const { Option } = Select

const currentDetailsInit: ListType = {
  serialNumber: '',
  img: '',
  name: '',
  number: 0,
  list: [],
  blockNumber: undefined,
  value: '',
  isImport: false,
}

const currentDetailsInit1: CardType = {
  tokenId: '',
  name: '',
  image: '',
  serialNumber: 0,
}

const acceptTypeCover = 'image/jpeg,image/png,image/gif'

export default memo(function MyProjectPage(props: any) {
  const { REACT_APP_ENV = 'prd' } = process.env
  let formRef = useRef<FormInstance>()

  const dispatch = useDispatch()
  const modalRef = useRef<any>(null)
  let history = useHistory()
  const { t } = useTranslation()
  const nftData: ConstantInitTypes = useDataHooks()
  const { myNftPageSize, payTokenOptions, constant, web3 } = nftData

  const web3Store: StorageClientTypes = useWeb3StoreHooks()
  const { client, storeFilesPapers, makeFileObjects } = web3Store

  const [onShow, setOnShow] = useState(false)
  const [currentDetails, setCurrentDetails] = useState<ListType>(currentDetailsInit)
  const [currentDetails1, setCurrentDetails1] = useState<CardType>(currentDetailsInit1)
  const [currentStatus, setCurrentStatus] = useState<'projectList' | 'detailsList' | 'import' | 'details'>('projectList')

  const [onShowCreate, setOnShowCreate] = useState(false)
  const [onShowCreateTwo, setOnShowCreateTwo] = useState(false)
  const [isRefreshData, setIsRefreshData] = useState(false)
  const myAddress = useSelector((state: any) => state.userInfo.address)
  const walletInfo = useSelector((state: any) => state.walletInfo)

  const { myProjectList, loading, myImportProjectList } = useMyProjectHooks({ myAddress, isRefreshData })
  const { serviceCharge } = useFeeUpdatedHooks()

  const [current, setCurent] = useState(1)
  const [spinLoading, setSpinLoading] = useState(false)
  const [loadingText, setLoadingText] = useState<string>('Loading...')

  const [imageUrlCover, setImageUrlCover] = useState<string>('')
  const [imageCidCover, setImageCidCover] = useState<any>(undefined)
  const [imageUrlCoverSource, setImageUrlCoverSource] = useState<string>('')
  const [importLoading, setLoading] = useState(false)
  const [isVerify, setIsVerify] = useState(false)
  const [isVerifAddress, setIsVerifyAddress] = useState<any>(undefined)

  useEffect(() => {
    const search = props.location.search
    historySearchSwitch(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, myProjectList])

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
        let data = myProjectList.filter((item) => item.serialNumber === list[0].value)
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

  const onFinishImport = (values: any) => {
    try {
      if (!imageCidCover) {
        message.warning({
          content: `Cover ${t('create.from2.rules')}`,
          className: 'message-global',
        })
        return false
      }
      console.log('values', values)
      console.log('isVerifAddress', isVerifAddress)
      setLoading(true)
      let obj = {
        name: values.name,
        cover: imageCidCover,
        coverFiles: imageUrlCoverSource,
        contract: isVerifAddress,
      }
      portfolioClick(obj)
    } catch (error) {
      console.log('err', error)
      setLoading(false)
    }
  }

  const portfolioClick = async (obj: any) => {
    try {
      let params = {
        ...obj,
        myAddress,
      }
      console.log('params', params)
      let files = makeFileObjects(params)
      let data: any = await storeFilesPapers(files, client, 'application/json')
      console.log('cover', data)
      let namebyte32 = getBytes32FromIpfsHash(data.cid)
      constant.ContractCategories.methods
        .add(namebyte32, isVerifAddress)
        .send({
          from: myAddress,
        })
        .on('transactionHash', function (hash: any) {
          console.log(hash)
        })
        .on('receipt', async (receipt: any) => {
          message.success({
            content: t('create.message.tip.success'),
            className: 'message-global',
          })
          setTimeout(() => {
            formRef.current!.resetFields()
            setImageUrlCover('')
            setImageCidCover(undefined)
            setIsVerify(false)
            setIsVerifyAddress(undefined)
            setOnShow(false)
            setLoading(false)
            setIsRefreshData(!isRefreshData)
            history.replace('/myproject')
          }, 500)
        })
        .on('error', function (error: any, receipt: any) {
          message.error({
            content: error.message,
            className: 'message-global',
          })
          setLoading(false)
        })
    } catch (error) {
      console.log('err', error)
      setLoading(false)
    }
  }

  const imageOrBase64 = async (info: any) =>
    getBase64(info, (img: any) => {
      setImageUrlCover(img)
    })

  const beforeUpload = (file: any) => {
    let isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'

    if (!isType) {
      message.error({
        content: t('create.message.tips3'),
        className: 'message-global',
      })
    }
    const isLt100M = file.size / 1024 / 1024 < 100
    if (!isLt100M) {
      message.error({
        content: t('create.message.tips2'),
        className: 'message-global',
      })
    }
    if (isType && isLt100M) {
      let isType2 = file.type
      setLoadingText('Uploading...')
      setLoading(true)
      if (client) manualUpload(file, isType2)
    }
    return false
  }

  const manualUpload = async (s: any, type: string) => {
    try {
      let data: any = await storeFilesPapers(s, client, type)
      console.log('cover', data)
      setImageCidCover(data.cid)
      setImageUrlCoverSource(data.url)
      if (type === 'image/jpeg' || type === 'image/png' || type === 'image/gif' || type === 'image/svg+xml') {
        imageOrBase64(s)
      } else {
        setImageUrlCover(data.url)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const verifyClick = async () => {
    formRef.current?.validateFields(['address']).then(async (res) => {
      console.log('res', res)
      console.log(myImportProjectList)
      let arrObj = myImportProjectList.filter((item) => item.contracts.toLowerCase() === res.address.toLowerCase())
      if (arrObj instanceof Array && arrObj.length > 0) {
        message.warning({
          content: t('myporject.message.tips2'),
          className: 'message-global',
        })
        return false
      }
      let isTrueAddress = await web3.utils.isAddress(res.address)
      if (!isTrueAddress) {
        message.error({
          content: t('myproject.import.msg1'),
          className: 'message-global',
        })
        formRef.current?.resetFields()
        return false
      }
      setLoading(true)
      await verifyContract(res.address)
    })
  }

  const verifyContract = async (address: string) => {
    let constantWeb3721 = new web3.eth.Contract(MarketSharedToken_ABI, address)
    constantWeb3721.methods
      .supportsInterface('0x80ac58cd')
      .call()
      .then(async (res: any) => {
        console.log('721', res)
        if (res) await verifyImplement(address)
      })
      .catch((error: any) => {
        setLoading(false)
        message.error({
          content: error.message,
          className: 'message-global',
        })
        console.log('error', error.message)
      })
  }

  const verifyImplement = async (address: string) => {
    setIsVerifyAddress(address)
    setIsVerify(true)
    setLoading(false)
  }

  const uploadButton = (
    <div className="upload-btn-hover">
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{t('create.upload.btn')}</p>
    </div>
  )

  const uploadExhibit = (
    <UploadCusDiv>
      <Image src={imageUrlCover} preview={false} height="8.25rem" width="auto"></Image>
    </UploadCusDiv>
  )

  return (
    <Spin spinning={spinLoading} tip={loadingText} className="antd-loadings">
      <Spin spinning={loading} tip="Loading..." className="antd-loadings">
        <MyProjectWrapper ref={modalRef}>
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
                {myProjectList.length > 0 && (
                  <>
                    {myProjectList.map((item, index) => (
                      <div key={index} className="content-nft-info">
                        <ListInfo onClick={() => history.replace(`/myproject?key=${item.serialNumber}`)}>
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
                {!loading && myProjectList.length === 0 && <NoData top={0} />}
                {/* {!loading && (
                <>
                  {myProjectList.length > 0 && (
                    <>
                      {myProjectList.map((item, index) => (
                        <div key={index} className="content-nft-info">
                          <ListInfo onClick={() => history.replace(`/myproject?key=${item.serialNumber}`)}>
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
              )} */}
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
                  <Button type="primary" disabled={currentDetails.isImport} className="create-btn" onClick={() => setOnShowCreateTwo(true)}>
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
                          console.log('sss')
                          setIsRefreshData(!isRefreshData)
                        }}
                        serviceCharge={serviceCharge}
                        setLoading={(s) => setSpinLoading(s)}
                        setLoadingText={(s) => setLoadingText(s)}
                      />
                    </div>
                  ))}
                {currentDetails.list.length === 0 && <NoData top={0} />}
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
                        <Button type="primary" className="create-btn-1" onClick={() => setOnShow(true)}>
                          <span>{t('myproject.import.list1.span')}</span>
                          <div className="p">{t('myproject.import.list1.p')}</div>
                        </Button>
                      </Col>
                    )}
                    {REACT_APP_ENV !== 'prd' && (
                      <Col span={24} xl={12}>
                        <Button className="create-btn-2" onClick={() => setOnShow(true)}>
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
            afterClose={() => {
              formRef.current!.resetFields()
              setImageUrlCover('')
              setImageCidCover(undefined)
              setIsVerify(false)
              setIsVerifyAddress(undefined)
            }}
            getContainer={modalRef.current}
          >
            <Spin spinning={importLoading} tip="Loading...">
              <Titles>{t('myproject.import.modal.title')}</Titles>
              <TitleTrue>{t('myproject.import.modal.f1')}</TitleTrue>
              <Form
                preserve={false}
                ref={formRef as any}
                onFinish={onFinishImport}
                initialValues={{ uint: payTokenOptions[0].label }}
                layout="vertical"
              >
                {!isVerify ? (
                  <Row>
                    <Col span={18}>
                      <Form.Item
                        name="address"
                        rules={[{ required: true, message: t('myproject.import.modal.rules') }]}
                        style={{ width: '100%' }}
                      >
                        <Input placeholder={t('myproject.import.modal.placeholder')} size="large"></Input>
                      </Form.Item>
                    </Col>
                    <Col span={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Form.Item>
                        <Button type="primary" className="my-home-btn-5" onClick={() => verifyClick()}>
                          {t('myproject.import.verify')}
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                ) : (
                  <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={18}>
                      <Input placeholder={t('myproject.import.modal.placeholder')} disabled value={isVerifAddress} size="large"></Input>
                    </Col>
                    <Col span={6}>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '1.13rem', marginLeft: '0.63rem' }} />
                    </Col>
                  </Row>
                )}
                <Divider plain dashed className="gray"></Divider>
                <div style={{ opacity: !isVerify ? 0.5 : 1 }}>
                  <h3>{t('myproject.import.h3')}</h3>
                  <Form.Item
                    label={
                      <span>
                        <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                        {t('create.from2.label')}
                      </span>
                    }
                    name="cover"
                    valuePropName="fileList"
                    style={{ position: 'relative' }}
                    // rules={[{ required: true, message: t('create.from2.rules') }]}
                  >
                    {imageCidCover && uploadExhibit}
                    <Upload.Dragger
                      className="uploader-files1"
                      name="files"
                      beforeUpload={beforeUpload}
                      maxCount={1}
                      accept={acceptTypeCover}
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      disabled={!isVerify}
                    >
                      {imageCidCover ? (
                        <Button type="text" size="large" className="modal-btns">
                          {t('create.upload.btn1')}
                        </Button>
                      ) : (
                        uploadButton
                      )}
                    </Upload.Dragger>
                  </Form.Item>
                  <TitleTrue>{t('create.from2.f1')}</TitleTrue>
                  <Form.Item label={t('create.from3.label')} name="name" rules={[{ required: true, message: t('create.from3.rules') }]}>
                    <Input placeholder={t('create.from3.placeholder')} maxLength={10} disabled={!isVerify} />
                  </Form.Item>
                  <Button className="my-home-btn-4" htmlType="submit" type="primary" disabled={!isVerify}>
                    {t('myproject.import.modal.btn')}
                  </Button>
                </div>
              </Form>
            </Spin>
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
            getContainer={modalRef.current}
          >
            <h2>{t('myproject.create.title1')}</h2>
            <Divider plain dashed className="gray"></Divider>
            <CreateProgram
              returnClick={(s) => {
                setOnShowCreate(s)
                setIsRefreshData(!isRefreshData)
                getWeb3StorageLocal(client, walletInfo.network, dispatch)
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
            getContainer={modalRef.current}
          >
            <h2>{t('myproject.create.title2')}</h2>
            <Divider plain dashed className="gray"></Divider>
            <CreateProject
              returnClick={(s) => {
                setOnShowCreateTwo(s)
                setIsRefreshData(!isRefreshData)
                getWeb3StorageLocal(client, walletInfo.network, dispatch)
              }}
              programDetails={currentDetails}
            />
          </Modal>
        </MyProjectWrapper>
      </Spin>
    </Spin>
  )
})
