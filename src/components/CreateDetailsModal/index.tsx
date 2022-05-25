import React, { memo, useEffect, useState, useRef } from 'react'
import { CreateDetailsModalWrapper, DescribeDiv, CurrentThemeDiv, ImageDiv, PriceDiv } from './styled'
import { CardModalWrapper } from '@/components/Card/styled'
import type { CardType } from '@/common/data.d'
import { Form, message, Modal, Select, InputNumber, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { Row, Col, Image, Button } from 'antd'
import { ImageError } from '@/common/init'
import ConnectWallet from '@/components/ConnectWallet'
import { useSelector } from 'react-redux'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { formatStrAddress, validateValue } from '@/utils'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import Modelviewer from '@/components/ModelViewer'
import NoData from '@/components/NoData'
import { nftPriceIcon, nftPriceIconColor } from '@/contracts/init'
import { ShopDiv, TableList } from '@/pages/Market/styled'
import { useDetailsHooks } from '@/hooks/useDetailsHooks'
import { MarketSharedToken_ABI } from '@/contracts/constant'

const ABILIST: any = {
  721: MarketSharedToken_ABI,
}

const ABILIST_ID: any = {
  721: '0x80ac58cd',
}

interface Type {
  details: CardType
  returnRefreshData: () => void
  serviceCharge?: string
}

const { Option } = Select

export default memo(function CreateDetailsModalPage(props: Type) {
  const modalRef = useRef<any>(null)
  const { t } = useTranslation()
  const { details, returnRefreshData, serviceCharge = '2.5' } = props
  const context = useWeb3React<Web3Provider>()
  const { active } = context
  const myAddress = useSelector((state: any) => state.userInfo.address)

  const { openBoxList, detailsLoading } = useDetailsHooks({ currentDetails: details })

  const nftData: ConstantInitTypes = useDataHooks()
  const { minimumSaleAmount, SharedToken_ADDRESS, Blockchain, payTokenOptions, constant, Market_ADDRESS, web3 } = nftData

  const [onMynftShow, setOnMynftShow] = useState(false)
  const [type, setType] = useState<string>('.png')
  const [uintSelect, setUintSelect] = useState<string>(() => {
    return payTokenOptions[0].label
  })

  const [isCancelLoading, setIsCancelLoading] = useState(false)
  const [isSellLoading, setIsSellloading] = useState(false)

  useEffect(() => {
    let s = details.image.substr(details.image.lastIndexOf('.'))
    setType(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details])

  const onFinish = async (values: any) => {
    console.log('Success:', values)
    let isTrueNumber = validateValue(values.pledge)
    if (!isTrueNumber) {
      message.warning({
        content: t('mynft.message.tips1', { msg: minimumSaleAmount }),
        className: 'message-global',
      })
      return false
    }
    if (Number(values.pledge) < minimumSaleAmount) {
      message.warning({
        content: t('mynft.message.tips1', { msg: minimumSaleAmount }),
        className: 'message-global',
      })
      return false
    }
    if (details.isImport) {
      if (details.contracts_type === 721) {
        let constantWeb3 = new web3.eth.Contract(ABILIST[details.contracts_type], details.contracts)
        let isTrue = await constantWeb3.methods.supportsInterface(ABILIST_ID[details.contracts_type]).call()
        if (isTrue) {
          sellClickImput(values, constantWeb3)
        }
      }
    } else sellClick(values)
  }

  /** my nft sell click */
  const sellClick = async (values: any) => {
    try {
      setIsSellloading(true)
      let isAuthorize = await constant.ContractMarketSharedToken.methods.isApprovedForAll(myAddress, Market_ADDRESS).call()
      if (!isAuthorize) {
        constant.ContractMarketSharedToken.methods
          .setApprovalForAll(Market_ADDRESS, true)
          .send({
            from: myAddress,
          })
          .on('transactionHash', function (hash: any) {
            console.log(hash)
          })
          .on('receipt', async (receipt: any) => {
            sellImplement(values)
          })
          .on('error', function (error: any, receipt: any) {
            message.error({
              content: error.message,
              className: 'message-global',
            })
            setIsSellloading(false)
          })
      } else {
        sellImplement(values)
      }
    } catch (error) {
      console.log('error', error)
      setIsSellloading(false)
    }
  }

  const sellClickImput = async (values: any, contract: any) => {
    try {
      setIsSellloading(true)
      let isAuthorize = await contract.methods.isApprovedForAll(myAddress, Market_ADDRESS).call()
      if (!isAuthorize) {
        contract.methods
          .setApprovalForAll(Market_ADDRESS, true)
          .send({
            from: myAddress,
          })
          .on('transactionHash', function (hash: any) {
            console.log(hash)
          })
          .on('receipt', async (receipt: any) => {
            sellImplement(values)
          })
          .on('error', function (error: any, receipt: any) {
            message.error({
              content: error.message,
              className: 'message-global',
            })
            setIsSellloading(false)
          })
      } else {
        sellImplement(values)
      }
    } catch (error) {
      console.log('error', error)
      setIsSellloading(false)
    }
  }

  const sellImplement = async (values: any) => {
    try {
      let price =
        values.uint === 'USDT' ? web3.utils.toWei(values.pledge.toString(), 'mwei') : web3.utils.toWei(values.pledge.toString(), 'ether')
      console.log('values', values, details, price)
      let currency = payTokenOptions.find((item) => item.label === values.uint).value
      console.log('currency', currency)
      constant.ContractMarket.methods
        .addCollectible(
          details.categoriesName,
          details.isImport ? details.contracts : SharedToken_ADDRESS,
          details.tokenId,
          '1',
          currency,
          price,
        )
        .send({
          from: myAddress,
        })
        .on('transactionHash', function (hash: any) {
          console.log(hash)
        })
        .on('receipt', async (receipt: any) => {
          message.success({
            content: t('mynft.message.tips2'),
            className: 'message-global',
          })
          setOnMynftShow(false)
          returnRefreshData()
        })
        .on('error', function (error: any, receipt: any) {
          message.error({
            content: error.message,
            className: 'message-global',
          })
          setIsSellloading(false)
        })
    } catch (error) {
      console.log('error', error)
      setIsSellloading(false)
    }
  }

  const uintOnChange = (e: any) => setUintSelect(e)

  /** my nft cancel click */
  const cancelClick = async () => {
    try {
      console.log('date', details)
      setIsCancelLoading(true)
      let isAuthorize = await constant.ContractMarketSharedToken.methods.isApprovedForAll(myAddress, Market_ADDRESS).call()
      if (!isAuthorize) {
        constant.ContractMarketSharedToken.methods
          .setApprovalForAll(Market_ADDRESS, true)
          .send({
            from: myAddress,
          })
          .on('transactionHash', function (hash: any) {
            console.log(hash)
          })
          .on('receipt', async (receipt: any) => {
            cancelImplement()
          })
          .on('error', function (error: any, receipt: any) {
            message.error({
              content: error.message,
              className: 'message-global',
            })
            setIsCancelLoading(false)
          })
      } else {
        cancelImplement()
      }
    } catch (error) {
      console.log('error', error)
      setIsCancelLoading(false)
    }
  }

  const cancelImplement = () => {
    try {
      constant.ContractMarket.methods
        .removeCollectible(details.collectibleHash)
        .send({ from: myAddress })
        .on('transactionHash', function (hash: any) {
          console.log(hash)
        })
        .on('receipt', async (receipt: any) => {
          message.success({
            content: t('mynft.message.tips3'),
            className: 'message-global',
          })
          setIsCancelLoading(false)
          returnRefreshData()
        })
        .on('error', function (error: any, receipt: any) {
          message.error({
            content: error.message,
            className: 'message-global',
          })
          setIsCancelLoading(false)
        })
    } catch (error) {
      console.log('error', error)
      setIsCancelLoading(false)
    }
  }

  return (
    <Spin spinning={isCancelLoading} tip="Loading..." className="antd-loadings">
      <CreateDetailsModalWrapper ref={modalRef}>
        <Row gutter={{ xs: 12, sm: 24, lg: 68 }} className="details-shop">
          <Col span={24} lg={12} md={8} className="details-shop-left">
            <ImageDiv>
              {(type === '.jpg' || type === '.png' || type === '.gif' || type === '.svg') && (
                <Image src={details.image} preview={false} fallback={ImageError}></Image>
              )}
              {(type === '.mp4' || type === '.webm') && <video src={details.image} controls autoPlay loop></video>}
              {(type === '.mp3' || type === '.wav' || type === '.ogg') && (
                <audio controls>
                  <source src={details.image} />
                </audio>
              )}
              {type === '.gltf' && <Modelviewer src={details.image} />}
            </ImageDiv>
            <DescribeDiv style={{ marginTop: '2.5rem' }}>
              <h3>{t('market.details.vice.title2')}</h3>
              <div className="info">
                <div className="span">{t('market.details.vice.title2.list1')}</div>
                {formatStrAddress(6, 4, details.isImport ? (details.contracts as any) : SharedToken_ADDRESS)}
              </div>
              <div className="info">
                <div className="span">{t('market.details.vice.title2.list2')}</div>
                {t('market.details.vice.title2.list.info1')}
              </div>
              <div className="info">
                <div className="span">{t('market.details.vice.title2.list3')}</div>
                {Blockchain}
              </div>
              <div className="info">
                <div className="span">{t('market.details.vice.title2.list4')}</div>
                {t('market.details.vice.title2.list.info3')}
              </div>
            </DescribeDiv>
          </Col>
          <Col span={24} lg={12} md={16} className="details-shop-right">
            <CurrentThemeDiv>
              {t('market.details.theme.title')}
              {details.nameTheme}
            </CurrentThemeDiv>
            <h2>{details.isDefault ? `${details.name}${details.tokenId}` : details.name}</h2>
            <DescribeDiv>
              <div className="price-content">
                {!active && <ConnectWallet status="shop" />}
                {active && details.status !== '2' && (
                  <Button className="my-home-btn-1 details-btns1" onClick={() => setOnMynftShow(true)}>
                    {t('mynft.sell.btn')}
                  </Button>
                )}
                {active && details.status === '2' && (
                  <>
                    <PriceDiv style={{ color: nftPriceIconColor[details.unit || ''] }}>
                      <Image src={nftPriceIcon[details.unit || '']} width="1.81rem" preview={false}></Image>
                      {details.unit === 'USDT' ? nftData.toWeiFromMwei(details.price) : nftData.toWeiFromWei(details.price)}
                      &nbsp;&nbsp;{details.unit}
                    </PriceDiv>
                    <h5>&nbsp;</h5>
                    <Button className="my-home-btn-1 details-btns1" onClick={() => cancelClick()}>
                      {t('mynft.sell.cancel')}
                    </Button>
                  </>
                )}
              </div>
            </DescribeDiv>
            <DescribeDiv className="addDes">
              <div className="info">
                <div className="span">{t('market.details.vice.title3')}</div>
                <span style={{ width: '100%', textAlign: 'end' }}>{Number(details.royalty)}%</span>
              </div>
              <div className="info">
                <div className="span">{t('market.details.vice.title5')}</div>
                <span style={{ width: '100%', textAlign: 'end' }}>{formatStrAddress(6, 4, details.royaltyAddress || '')}</span>
              </div>
              <div className="info">
                <div className="span">{t('market.details.vice.title4')}</div>
                <span style={{ width: '100%', textAlign: 'end' }}>{details.time}</span>
              </div>
            </DescribeDiv>
            <DescribeDiv>
              <h3>{t('market.details.vice.title1')}</h3>
              {details.description && (
                <ul>
                  <li>{details.description}</li>
                </ul>
              )}
              {!details.description && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <NoData top={0} />
                </div>
              )}
            </DescribeDiv>
          </Col>
          <Col span={24}>
            <ShopDiv style={{ marginBottom: '2.5rem' }}>
              <h3>{t('market.list.title')}</h3>
              {!detailsLoading && openBoxList.length > 0 && (
                <TableList>
                  <thead>
                    <tr>
                      <th>{t('market.list.th1')}</th>
                      <th>{t('market.list.th2')}</th>
                      <th>{t('market.list.th3')}</th>
                      <th>{t('market.list.th4')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openBoxList.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <Image src={nftPriceIcon[item.unit || '']} width="0.75rem" preview={false}></Image>
                          <span style={{ marginLeft: '0.63rem' }}>{item.price}</span>
                        </td>
                        <td>{formatStrAddress(6, 4, item.from)}</td>
                        <td>{formatStrAddress(6, 4, item.to)}</td>
                        <td style={{ color: '#5746FE' }}>{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableList>
              )}
              {detailsLoading && (
                <div className="loadings">
                  <Spin tip="Loading..." />
                </div>
              )}
              {!detailsLoading && openBoxList.length === 0 && <NoData top={0} />}
            </ShopDiv>
          </Col>
        </Row>
        <Modal
          visible={onMynftShow}
          className="modal-mask"
          footer={null}
          onCancel={() => setOnMynftShow(false)}
          width="55.63rem"
          centered
          getContainer={modalRef.current}
          bodyStyle={{ padding: '5rem 1.5rem' }}
        >
          <Spin tip="SellLoading..." spinning={isSellLoading}>
            <Row gutter={[16, 32]} className="sell-row">
              <Col span={24} lg={14}>
                <Form onFinish={onFinish} initialValues={{ uint: payTokenOptions[0].label }}>
                  <h2>{t('mynft.sell.modal.title')}</h2>
                  <div className="pledge-content">
                    <div className="input-titles">
                      <span>{t('mynft.sell.modal.input.title')}</span>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <Form.Item name="uint" rules={[{ required: true, message: t('mynft.form.item.rules1') }]}>
                        <Select className="select-before" size="large" onChange={uintOnChange}>
                          {payTokenOptions.map((item, index) => (
                            <Option value={item.label} key={index}>
                              {item.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item name="pledge" rules={[{ required: true, message: t('mynft.form.item.rules2') }]} className="inputs">
                        <InputNumber
                          style={{ width: '100%' }}
                          type="number"
                          precision={6}
                          min={0.000001}
                          max={999999999.999999}
                          placeholder={t('mynft.sell.modal.input.placeholder')}
                          addonAfter={uintSelect}
                          size="large"
                        ></InputNumber>
                      </Form.Item>
                    </div>

                    <div className="input-titless">
                      <span>{t('mynft.sell.modal.input.title1')}</span>
                      <span>{Number(details.royalty)}%</span>
                    </div>
                    <div className="input-min-title">{t('mynft.sell.modal.input.titles')}</div>

                    <div className="input-titless">
                      <span>{t('mynft.sell.modal.input.title3')}</span>
                      <span>{serviceCharge}%</span>
                    </div>
                    <Button className="my-home-btn-3" htmlType="submit" type="primary">
                      {t('mynft.sell.btn')}
                    </Button>
                  </div>
                </Form>
              </Col>
              <Col span={24} lg={10}>
                <CardModalWrapper>
                  <Image src={details.cover || details.image} className="card-modal-img" preview={false} fallback={ImageError} />
                  <div className="title">{details.isDefault ? `${details.name}${details.tokenId}` : details.name}</div>
                </CardModalWrapper>
              </Col>
            </Row>
          </Spin>
        </Modal>
      </CreateDetailsModalWrapper>
    </Spin>
  )
})
