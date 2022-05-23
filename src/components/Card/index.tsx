import React, { memo, useState } from 'react'
import { CardWrapper, Span, MyNftContent, CardModalWrapper, SpanStatus3, CardBuilt, ImageDiv, CardModalImage } from './styled'
import type { CardType } from '@/common/data.d'
import { Image, Button, Row, Col, Modal, message, Select, Form, Divider, InputNumber } from 'antd'
import { Adapth5, formatStrAddress, validateValue } from '@/utils'
import { useWindowSizeHooks } from '@/hooks/useWindowSizeHooks'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import ConnectWallet from '@/components/ConnectWallet'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ImageError } from '@/common/init'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import Loading from '@/components/Loading'
import useDataHooks from '@/hooks/useDataHooks'
import { nftPriceIcon } from '@/contracts/init'

const { Option } = Select

interface Type {
  details: CardType
  keys: string
  returnClick: (s: CardType) => void
  returnRefreshData: () => void
  returnBuyClcik: (s: CardType) => void
  serviceCharge?: string
}

export default memo(function CardPage(pages: Type) {
  const context = useWeb3React<Web3Provider>()
  const { active } = context
  const myAddress = useSelector((state: any) => state.userInfo.address)

  const nftData: ConstantInitTypes = useDataHooks()
  const { minimumSaleAmount, constant, web3, SharedToken_ADDRESS, Market_ADDRESS, payTokenOptions } = nftData

  const { t } = useTranslation()

  const { details, returnClick, keys, returnRefreshData, returnBuyClcik, serviceCharge = '2.5' } = pages
  const [onMynftShow, setOnMynftShow] = useState(false)
  const [isSellLoading, setIsSellloading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)
  const [uintSelect, setUintSelect] = useState<string>(() => {
    return payTokenOptions[0].label
  })

  const { windowSize } = useWindowSizeHooks()

  const switchClick = () => {
    if (keys === 'nft') {
      returnClick(details)
      return false
    }
  }

  const switchClickTwo = () => {
    if (keys === 'tradingFloor' || keys === 'myproject' || keys === 'mynft') {
      returnClick(details)
      return false
    }
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

  const sellImplement = async (values: any) => {
    try {
      let price = web3.utils.toWei(values.pledge.toString(), 'ether')
      console.log('values', values, details, price)
      let currency = payTokenOptions.find((item) => item.label === values.uint).value
      console.log('currency', currency)
      constant.ContractMarket.methods
        .addCollectible(details.categoriesName, SharedToken_ADDRESS, details.tokenId, '1', currency, price)
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

  /** transaction building buy click */
  const buyClcik = () => returnBuyClcik(details)

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

  const onFinish = (values: any) => {
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
    sellClick(values)
  }

  const uintOnChange = (e: any) => setUintSelect(e)

  return (
    <CardWrapper onClick={switchClick}>
      <ImageDiv>
        <Image src={details.cover || details.image} className="card-img" preview={false} onClick={switchClickTwo} fallback={ImageError} />
      </ImageDiv>
      {keys === 'nft' && <Span>{details.name}</Span>}
      {keys === 'mynft' && (
        <>
          <SpanStatus3>
            <Row>
              <Col span={24} className="three-span1">
                {t('myproject.theme.title')}&nbsp;&nbsp;{details.nameTheme}
              </Col>
              <Col span={24} className="three-span">
                {details.name}
              </Col>
            </Row>
          </SpanStatus3>
          {details.isSelfBuilt && <CardBuilt>{t('mynft.sefl.title')}</CardBuilt>}
        </>
      )}
      {keys === 'myproject' && (
        <SpanStatus3>
          <Row>
            <Col span={24} className="three-span1" onClick={switchClickTwo}>
              {t('myproject.theme.title')}&nbsp;&nbsp;{details.nameTheme}
            </Col>
            <Col span={24} className="three-span" onClick={switchClickTwo}>
              {details.name}
            </Col>
          </Row>
        </SpanStatus3>
      )}
      {keys === 'tradingFloor' && (
        <>
          <div className={Adapth5 < windowSize.innerWidth ? 'divss' : 'divss dirce'} onClick={switchClickTwo}>
            <h5 title={details.nameTheme}> {details.nameTheme} </h5>
            <h5 style={{ color: '#363639' }}>{formatStrAddress(6, 4, details.address || '')}</h5>
          </div>
          <div className="divss dirce" onClick={switchClickTwo}>
            <h4 title={`${details.name}`} style={{ color: '#80808B' }}>
              <span>{details.name}</span>
            </h4>
            {details.isSell && (
              <h4 className="price-h4">
                <Image src={nftPriceIcon[details.unit || '']} className="icosns" preview={false}></Image>
                <span>{Number(nftData.toWeiFromWei(details.price))}</span>
                {/* &nbsp;{details.unit} */}
              </h4>
            )}
          </div>
          <div
            className={Adapth5 < windowSize.innerWidth ? 'divss' : 'divss ssss-h5'}
            style={{ marginTop: '0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {!active && <ConnectWallet status="buynow" />}
            {active && details.isSell && (
              <Button className="buy-now-btn" onClick={() => buyClcik()}>
                {t('market.list.buy.now')}
              </Button>
            )}
            {active && !details.isSell && (
              <Button className="buy-now-btn1" onClick={switchClickTwo}>
                {t('market.list.details.tips')}
              </Button>
            )}
          </div>
        </>
      )}
      {(keys === 'mynft' || keys === 'myproject') && (
        <>
          <Divider plain className="gray" style={{ margin: '0.88rem 0', width: 'calc(100% - 1.88rem)', minWidth: 'auto' }}></Divider>
          <MyNftContent>
            {(details.status === '0' || details.status === '1') && (
              <Row>
                <Col span={24}>
                  <Button
                    className="mynft-btn-1 sells"
                    onClick={() => {
                      setOnMynftShow(true)
                    }}
                  >
                    {t('mynft.sell.btn')}
                  </Button>
                </Col>
              </Row>
            )}
            {details.status === '2' && (
              <Row style={{ margin: '0 0.94rem' }}>
                <Col span={12}>
                  <div className="eth-span">
                    <Image
                      src={nftPriceIcon[details.unit || '']}
                      width="0.69rem"
                      style={{ display: 'flex', alignItems: 'center' }}
                      preview={false}
                    ></Image>
                    <span style={{ marginLeft: '0.25rem' }}>{Number(nftData.toWeiFromWei(details.price as any))}&nbsp;</span>
                    {/* <span style={{ marginLeft: '0.25rem' }}>
                      {nftData.toWeiFromWei(details.price as any)}&nbsp;{details.unit}
                    </span> */}
                  </div>
                </Col>
                <Col span={12}>
                  <Button className="mynft-btn-1" style={{ width: '100%' }} onClick={() => cancelClick()}>
                    {t('mynft.sell.cancel')}
                  </Button>
                </Col>
              </Row>
            )}
          </MyNftContent>
        </>
      )}
      <Modal
        visible={onMynftShow}
        className="modal-mask"
        footer={null}
        onCancel={() => setOnMynftShow(false)}
        width="55.63rem"
        centered
        bodyStyle={{ padding: '5rem 1.5rem' }}
      >
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
              <CardModalImage>
                <Image src={details.cover || details.image} className="card-modal-img" preview={false} fallback={ImageError} />
              </CardModalImage>
              <div className="title">{details.name}</div>
            </CardModalWrapper>
          </Col>
        </Row>
      </Modal>
      {isSellLoading && <Loading title="SellLoading" />}
      {isCancelLoading && <Loading />}
    </CardWrapper>
  )
})
