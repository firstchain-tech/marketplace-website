import React, { memo, useEffect, useRef, useState } from 'react'
import { RightCircleOutlined, LeftCircleOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons'
import { Row, Col, Image, Button, InputNumber, Pagination, Drawer, Spin, Input } from 'antd'
import { Link } from 'react-router-dom'
import {
  TradingFloorWrapper,
  TradingFloorLeft,
  TradingFloorContent,
  TradingFloorTitle,
  TitlteRight,
  Title,
  RightContent,
  SelectionDiv,
  RightTitle,
  PriceDivCard,
  SelectionNumDiv,
  H5Bottom,
  PriceDiv,
  CurrentThemeDiv,
  DescribeDiv,
  ShopDiv,
  TableList,
  NftList,
  customStylesPay,
  ImageDiv,
  SearchInput,
} from './styled'
import { ImageError } from '@/common/init'
import { MenusList } from '@/components/SelectNetWork/styled'
import Loading from '@/components/Loading'
import { Adapth5 } from '@/utils'
import Select, { components } from 'react-select'
import { message } from 'antd'
import { useMarketHooks } from '@/hooks/useMarketHooks'
import Card from '@/components/Card'
import { useWindowSizeHooks } from '@/hooks/useWindowSizeHooks'
import type { CardType } from '@/common/data.d'
import ConnectWallet from '@/components/ConnectWallet'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { formatStrAddress, fuzzyMatch } from '@/utils'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import NoData from '@/components/NoData'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { ComLayoutTwo } from '@/common/styled'
import { FILTER_ICON } from '@/common/init'
import SelectNetWork from '@/components/SelectNetWork'
import type { NftListType } from '@/common/data.d'
import { nftListStatusInit } from '@/contracts/init'
import Modelviewer from '@/components/ModelViewer'
import { nftPriceIcon, nftPriceIconColor } from '@/contracts/init'

const currentDetailsInit: CardType = {
  name: '',
  image: '',
  serialNumber: 0,
  tokenId: '',
}

export default memo(function TradingFloorPage(props: any) {
  const context = useWeb3React<Web3Provider>()
  const { active } = context
  const { t } = useTranslation()
  let history = useHistory()

  const marketH5Drawer = useRef<any>(null)

  const nftData: ConstantInitTypes = useDataHooks()
  const { tradePageSize, Blockchain, payTokenOptions, web3, constant, toWeiFromWei, Market_ADDRESS, SharedToken_ADDRESS } = nftData

  const [currentDetails, setCurrentDetails] = useState<CardType>(currentDetailsInit)
  const [nftListStatus, setNftListStatus] = useState<NftListType[]>(JSON.parse(JSON.stringify(nftListStatusInit)))

  const [isShow, setIsShow] = useState(true)
  const [priceNum, setPriceNum] = useState<{ min: number | undefined; max: number | undefined }>({ min: undefined, max: undefined })
  const [priceNumStatus, setPriceNumStatus] = useState(false)

  const [pirceH5Min, setPriceH5Min] = useState<number | undefined>(undefined)
  const [pirceH5Max, setPriceH5Max] = useState<number | undefined>(undefined)

  const [selectPayActive, setSelectPayActive] = useState<any>(() => {
    return payTokenOptions[0]
  })
  const [isMaskOptions, setIsMaskOptions] = useState(false)

  const [current, setCurent] = useState(1)
  const [currentStatus, setCurrentStatus] = useState<'list' | 'details'>('list')

  const [isRefreshData, setIsRefreshData] = useState(false)
  const [isLoading, setIsloading] = useState(false)

  const myAddress = useSelector((state: any) => state.userInfo.address)

  const { tradList, loading, openBoxList, detailsLoading } = useMarketHooks({ isRefreshData, currentDetails })
  const { windowSize } = useWindowSizeHooks()
  const [moveSwitch, setMoveSwitch] = useState(false)

  const [type, setType] = useState<string>('.png')
  const [searchValue, setSearchValue] = useState<any>(undefined)
  const searchRef = useRef<any>(null)

  useEffect(() => {
    const search = props.location.search
    historySearchSwitch(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, tradList])

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  useEffect(() => {
    if (typeof priceNum.min !== 'number' && typeof priceNum.max !== 'number') {
      setPriceNumStatus(false)
    }
    if (typeof priceNum.min === 'number' && typeof priceNum.max === 'number') {
      if (priceNum.min > priceNum.max) {
        setPriceNum({
          min: priceNum.min,
          max: priceNum.min,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceNum])

  const historySearchSwitch = (search: any) => {
    if (search && tradList.length !== 0) {
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
        let data = tradList.filter((item) => item.serialNumber === list[0].value)
        if (data.length === 0) {
          message.error({
            content: t('market.message.tips'),
            className: 'message-global',
          })
          setTimeout(() => {
            history.replace('/market')
          }, 500)
          return false
        }
        setCurrentStatus('details')
        setCurrentDetails(data[0])
        let s = data[0].image.substr(data[0].image.lastIndexOf('.'))
        setType(s)
      }
    } else {
      setCurrentStatus('list')
    }
  }

  const paginationChange = (page: any, pageSize: any) => setCurent(page)

  const reset = () => {
    setPriceNum({ min: undefined, max: undefined })
    setNftListStatus(JSON.parse(JSON.stringify(nftListStatusInit)))
    setPriceNumStatus(false)
    searchRef.current.state.value = ''
    setSearchValue(undefined)
  }

  const selectPayOnChange = (val: any) => {
    setSelectPayActive(val)
    setIsMaskOptions(false)
    setPriceNum({ min: undefined, max: undefined })
    setPriceNumStatus(false)
  }

  const selectPayOnChangeH5 = (val: any) => {
    setSelectPayActive(val)
    setIsMaskOptions(false)
  }

  const applyClickNum = () => {
    if (typeof priceNum.min !== 'number' && typeof priceNum.max !== 'number') {
      message.warning({
        content: t('market.message.tips1'),
        className: 'message-global',
      })
    } else if (typeof priceNum.min === 'number' && typeof priceNum.max === 'number') {
      if (priceNum.min > priceNum.max) {
        message.warning({
          content: t('market.message.tips2'),
          className: 'message-global',
        })
      } else {
        setCurent(1)
        setPriceNumStatus(true)
      }
    } else {
      setCurent(1)
      setPriceNumStatus(true)
    }
  }

  const applyClickNumH5 = (obj: any) => {
    let min = pirceH5Min ? Number(pirceH5Min) : undefined
    let max = pirceH5Max ? Number(pirceH5Max) : undefined
    setPriceNum({ min, max })
    if (typeof min !== 'number' && typeof max !== 'number') {
      message.warning({
        content: t('market.message.tips1'),
        className: 'message-global',
      })
    } else if (typeof min === 'number' && typeof max === 'number') {
      if (min > max) {
        message.warning({
          content: t('market.message.tips2'),
          className: 'message-global',
        })
      } else {
        setMoveSwitch(false)
        window.scrollTo(0, 0)
        setPriceNumStatus(true)
        setCurent(1)
      }
    } else {
      setMoveSwitch(false)
      window.scrollTo(0, 0)
      setPriceNumStatus(true)
      setCurent(1)
    }
  }

  const buyClcik = async (obj?: CardType) => {
    let params = obj ? obj : currentDetails
    if (myAddress.toLowerCase() === params.address?.toLowerCase()) {
      message.warning({
        content: t('market.message.tips3'),
        className: 'message-global',
      })
      return false
    }
    if (params.unit === 'USDT') buyClickUsdt(params)
    else buyClickNative(params)
  }

  const buyClickNative = async (params: CardType) => {
    let balance = await web3.eth.getBalance(myAddress)
    let balanceToWei = toWeiFromWei(balance)
    let pricesToWei = toWeiFromWei(params.price)
    if (Number(pricesToWei) > Number(balanceToWei)) {
      message.warning({
        content: `${t('market.message.tips4', { msg: payTokenOptions[0].label })} ${balanceToWei}`,
        className: 'message-global',
      })
      return false
    }
    setIsloading(true)
    buyNftNativeImplement(params)
  }

  const buyNftNativeImplement = async (obj: CardType) => {
    try {
      constant.ContractMarket.methods
        .purchase(obj.collectibleHash, 1)
        .send({ from: myAddress, value: obj.price })
        .on('transactionHash', function (hash: any) {
          console.log(hash)
        })
        .on('receipt', async (receipt: any) => {
          console.log('receipt', receipt)
          message.success({
            content: t('market.buy.success'),
            className: 'message-global',
          })
          history.replace('/market')
          setIsRefreshData(!isRefreshData)
          setIsloading(false)
        })
        .on('error', function (error: any, receipt: any) {
          message.error({
            content: error.message,
            className: 'message-global',
          })
          console.log('购买error', error)
          setIsloading(false)
        })
    } catch (error) {
      setIsloading(false)
      console.log('error', error)
    }
  }

  const buyClickUsdt = async (params: CardType) => {
    let balanceUsdt = await constant.ContractUsdt.methods.balanceOf(myAddress).call()
    let balanceToWei = toWeiFromWei(balanceUsdt)
    console.log('balanceUsdt', balanceUsdt)
    let pricesToWei = toWeiFromWei(params.price)
    if (Number(pricesToWei) > Number(balanceToWei)) {
      message.warning({
        content: `${t('market.message.tips4', { msg: 'USDT' })} ${balanceToWei}`,
        className: 'message-global',
      })
      return false
    }
    setIsloading(true)
    buyNftUsdtisAuthorize(params)
  }

  const buyNftUsdtisAuthorize = async (params: CardType) => {
    try {
      let AuthorizedAmount = await constant.ContractUsdt.methods.allowance(myAddress, Market_ADDRESS).call()
      if (AuthorizedAmount < (params.price || '0')) {
        constant.ContractUsdt.methods
          .approve(Market_ADDRESS, params.price)
          .send({
            from: myAddress,
          })
          .on('transactionHash', function (hash: any) {
            console.log(hash)
          })
          .on('receipt', async (receipt: any) => {
            buyNftUsdtImplement(params)
          })
          .on('error', function (error: any, receipt: any) {
            message.error({
              content: error.message,
              className: 'message-global',
            })
            setIsloading(false)
          })
      } else buyNftUsdtImplement(params)
    } catch (error) {
      setIsloading(false)
      console.log('error', error)
    }
  }

  const buyNftUsdtImplement = async (obj: CardType) => {
    try {
      constant.ContractMarket.methods
        .purchase(obj.collectibleHash, '1')
        .send({ from: myAddress })
        .on('transactionHash', function (hash: any) {
          console.log(hash)
        })
        .on('receipt', async (receipt: any) => {
          console.log('receipt', receipt)
          message.success({
            content: t('market.buy.success'),
            className: 'message-global',
          })
          history.replace('/market')
          setIsRefreshData(!isRefreshData)
          setIsloading(false)
        })
        .on('error', function (error: any, receipt: any) {
          message.error({
            content: error.message,
            className: 'message-global',
          })
          console.log('购买error', error)
          setIsloading(false)
        })
    } catch (error) {
      setIsloading(false)
      console.log('error', error)
    }
  }

  const nftListClick = (item: NftListType, is?: boolean) => {
    if (is) item.active = !item.active
    else if (!item.active) item.active = !item.active
    let list = Array.from(new Set([...[item], ...nftListStatus]))
    list.forEach((res) => {
      if (is && res.value === '') {
        res.active = true
      } else if (res.value !== item.value) {
        res.active = false
      }
    })
    setNftListStatus(() => {
      list = list.sort((n1: any, n2: any) => {
        return n1.value - n2.value
      })
      return JSON.parse(JSON.stringify(list))
    })
  }

  const onSearch = (e: any) => {
    setCurent(1)
    setSearchValue(e)
  }

  const DropdownIndicatorPrice = (props: any) => (
    <components.DropdownIndicator {...props}>
      <DownOutlined style={{ color: '#5746FE' }} />
    </components.DropdownIndicator>
  )

  const MenuListH5 = (props: any) => {
    return (
      <components.MenuList {...props}>
        {payTokenOptions.map((item: any, i: number) => (
          <MenusList key={i} onClick={() => selectPayOnChangeH5(item)}>
            <div className="network-content">
              <h3>{item.label}</h3>
            </div>
          </MenusList>
        ))}
      </components.MenuList>
    )
  }

  const MenuList = (props: any) => {
    return (
      <components.MenuList {...props}>
        {payTokenOptions.map((item: any, i: number) => (
          <MenusList key={i} onClick={() => selectPayOnChange(item)}>
            <div className="network-content">
              <h3>{item.label}</h3>
            </div>
          </MenusList>
        ))}
      </components.MenuList>
    )
  }

  const Control1 = ({ children, ...props }: any) => {
    return (
      <div style={{ borderRadius: 10 }}>
        <components.Control {...props}>{children}</components.Control>
      </div>
    )
  }

  const H5Trading = () => {
    return (
      <Drawer
        height="60vh"
        key="TradingFloorH5"
        className="drawer-trading"
        placement="bottom"
        onClose={() => setMoveSwitch(false)}
        visible={moveSwitch}
        closable={true}
        getContainer={marketH5Drawer.current}
      >
        <RightContent style={{ paddingTop: '0' }}>
          <SelectionDiv>
            <div>
              <Image src={FILTER_ICON} width="1.48rem" preview={false}></Image>
              <span>{t('market.left.title')}</span>
            </div>
          </SelectionDiv>

          <RightTitle>{t('market.left.title.vice1')}</RightTitle>
          <div className="nft-list">
            {nftListStatus.map((item, i) => (
              <Button className={item.active ? 'nft-btn active' : 'nft-btn'} key={i} onClick={() => nftListClick(item)}>
                {item.lable}
              </Button>
            ))}
          </div>

          <RightTitle>{t('market.left.title.vice2')}</RightTitle>
          <PriceDivCard>
            <Col span={22}>
              <Select
                menuIsOpen={isMaskOptions}
                onMenuOpen={() => setIsMaskOptions(true)}
                onMenuClose={() => setIsMaskOptions(false)}
                styles={customStylesPay}
                isSearchable={false}
                options={payTokenOptions}
                placeholder={t('market.input.placeholder1')}
                value={selectPayActive}
                components={{ DropdownIndicator: DropdownIndicatorPrice, MenuList: MenuListH5, Control: Control1 }}
              />
            </Col>
          </PriceDivCard>
          <Row className="price-number">
            <Col span={11}>
              <InputNumber
                type="number"
                precision={6}
                placeholder="MIN"
                min={0}
                max={999999999.999999}
                name="min_number"
                defaultValue={pirceH5Min}
                onBlur={({ target }: any) => setPriceH5Min(target.value)}
              />
            </Col>
            <Col span={2} className="price-num-to">
              to
            </Col>
            <Col span={11}>
              <InputNumber
                type="number"
                precision={6}
                placeholder="MAX"
                min={0}
                max={999999999.999999}
                name="max_number"
                defaultValue={pirceH5Max}
                onBlur={({ target }: any) => setPriceH5Max(target.value)}
              />
            </Col>
          </Row>
          <Button className="apply-btn" type="primary" onClick={applyClickNumH5}>
            {t('market.left.title.vice2.btn')}
          </Button>
        </RightContent>
      </Drawer>
    )
  }

  return (
    <TradingFloorWrapper ref={marketH5Drawer}>
      <H5Trading />
      {currentStatus === 'list' && (
        <>
          {windowSize.innerWidth < Adapth5 && (
            <>
              <H5Bottom>
                <Button className="su-btn" onClick={() => setMoveSwitch(true)}>
                  {t('market.left.title')}
                </Button>
              </H5Bottom>
            </>
          )}
          <Row>
            {windowSize.innerWidth >= Adapth5 && (
              <Col
                span={isShow ? 8 : 2}
                md={isShow ? 6 : 2}
                xl={isShow ? 4 : 2}
                className={isShow ? 'left' : ''}
                style={{
                  borderRight: '1px solid #e5e5e5',
                }}
              >
                <TradingFloorLeft>
                  {!isShow && <RightCircleOutlined className="left-icon" onClick={() => setIsShow(true)} />}
                  {isShow && (
                    <RightContent>
                      <SelectionDiv>
                        <div>
                          <Image src={FILTER_ICON} width="1.48rem" preview={false}></Image>
                          <span>{t('market.left.title')}</span>
                        </div>
                        <LeftCircleOutlined className="left-active-icon" onClick={() => setIsShow(false)} />
                      </SelectionDiv>

                      <RightTitle>{t('market.left.title.vice1')}</RightTitle>
                      <div className="nft-list">
                        {nftListStatus.map((item, i) => (
                          <Button className={item.active ? 'nft-btn active' : 'nft-btn'} key={i} onClick={() => nftListClick(item)}>
                            {item.lable}
                          </Button>
                        ))}
                      </div>

                      <RightTitle>{t('market.left.title.vice2')}</RightTitle>
                      <PriceDivCard>
                        <Col span={20}>
                          <Select
                            menuIsOpen={isMaskOptions}
                            onMenuOpen={() => setIsMaskOptions(true)}
                            onMenuClose={() => setIsMaskOptions(false)}
                            styles={customStylesPay}
                            isSearchable={false}
                            options={payTokenOptions}
                            placeholder={t('market.input.placeholder1')}
                            onChange={selectPayOnChange}
                            value={selectPayActive}
                            components={{ DropdownIndicator: DropdownIndicatorPrice, MenuList, Control: Control1 }}
                          />
                        </Col>
                      </PriceDivCard>

                      <Row className="price-number">
                        <Col span={11}>
                          <InputNumber
                            type="number"
                            precision={6}
                            placeholder="MIN"
                            min={0}
                            max={999999999.999999}
                            value={priceNum.min}
                            onChange={(s) => setPriceNum({ ...priceNum, min: s })}
                          />
                        </Col>
                        <Col span={2} className="price-num-to">
                          to
                        </Col>
                        <Col span={11}>
                          <InputNumber
                            type="number"
                            precision={6}
                            placeholder="MAX"
                            min={priceNum.min}
                            max={999999999.999999}
                            onChange={(s) => setPriceNum({ ...priceNum, max: s })}
                            value={priceNum.max}
                          />
                        </Col>
                      </Row>
                      <Button className="apply-btn" type="primary" onClick={applyClickNum}>
                        {t('market.left.title.vice2.btn')}
                      </Button>
                      <RightTitle>{t('market.left.title.vice3')}</RightTitle>
                      <SelectNetWork status="Market" />
                    </RightContent>
                  )}
                </TradingFloorLeft>
              </Col>
            )}

            <Col span={24} md={isShow ? 17 : 22} xl={isShow ? 17 : 22}>
              <TradingFloorTitle active={isShow}>
                <Title>
                  <Link to={'/market'}>{t('market.title')}</Link>
                </Title>
                <SearchInput>
                  <Input.Search
                    ref={searchRef}
                    onBlur={({ target }) => onSearch(target.value)}
                    placeholder="search"
                    defaultValue={searchValue}
                    onSearch={onSearch}
                  />
                </SearchInput>
              </TradingFloorTitle>
              <TradingFloorContent active={isShow}>
                <TitlteRight>
                  <div className="left">
                    {nftListStatus
                      .filter((item) => item.value !== '')
                      .filter((item) => item.active === true)
                      .map((item, i) => (
                        <SelectionNumDiv key={i}>
                          <div className="leftsss">{item.lable}</div>
                          <CloseOutlined className="right-icons" onClick={() => nftListClick(item, true)} />
                        </SelectionNumDiv>
                      ))}
                    {priceNumStatus && (
                      <SelectionNumDiv>
                        <div>
                          <Image src={nftPriceIcon[selectPayActive.label]} className="icons" preview={false}></Image>
                          {selectPayActive.label}:&nbsp;&nbsp;
                          {typeof priceNum.min === 'number' && typeof priceNum.max === 'number' && (
                            <>
                              <span>{priceNum.min}</span>-<span>{priceNum.max}</span>
                            </>
                          )}{' '}
                          {typeof priceNum.min === 'number' && typeof priceNum.max !== 'number' && (
                            <>
                              {'>='}
                              <span>{priceNum.min}</span>
                            </>
                          )}{' '}
                          {typeof priceNum.min !== 'number' && typeof priceNum.max === 'number' && (
                            <>
                              {'<='}
                              <span>{priceNum.max}</span>
                            </>
                          )}
                        </div>

                        <CloseOutlined
                          className="right-icons"
                          onClick={() => {
                            setPriceNum({ min: undefined, max: undefined })
                            setPriceNumStatus(false)
                          }}
                        />
                      </SelectionNumDiv>
                    )}
                    <Button className="reset-btn" type="text" onClick={() => reset()}>
                      {t('market.left.reset')}
                    </Button>
                  </div>
                </TitlteRight>
                <div className="content-nft">
                  <NftList>
                    {!loading && (
                      <>
                        {tradList
                          .filter((item) => {
                            if (searchValue) return fuzzyMatch(item.name, searchValue)
                            else return true
                          })
                          .filter((item) => {
                            if (searchValue && item.nameTheme) return fuzzyMatch(item.name, searchValue)
                            else return true
                          })
                          .filter((item) => {
                            let obj = nftListStatus.find((item) => item.value === '1')
                            return obj?.active ? item.isSell === true : true
                          })
                          .filter((item) => {
                            if (priceNumStatus) {
                              return item.unit === selectPayActive.label
                            } else return true
                          })
                          .filter((item) => {
                            if (priceNumStatus) {
                              if (priceNum.min && priceNum.max)
                                return (
                                  Number(nftData.toWeiFromWei(item.price)) >= priceNum.min &&
                                  Number(nftData.toWeiFromWei(item.price)) <= priceNum.max
                                )
                              else if (priceNum.min) return Number(nftData.toWeiFromWei(item.price)) >= priceNum.min
                              else if (priceNum.max) return Number(nftData.toWeiFromWei(item.price)) <= priceNum.max
                              else return true
                            } else return true
                          })
                          .filter((item, i) => i < current * (tradePageSize || 16) && i >= (current - 1) * (tradePageSize || 16))
                          .map((item, i) => (
                            <div key={i} className="content-nft-info">
                              <Card
                                details={item}
                                keys="tradingFloor"
                                returnRefreshData={() => {}}
                                returnClick={(s) => history.replace(`/market?key=${s.serialNumber}`)}
                                returnBuyClcik={(s) => buyClcik(s)}
                              />
                            </div>
                          ))}
                      </>
                    )}
                    {loading && (
                      <div className="loadings">
                        <Spin tip="Loading..." />
                      </div>
                    )}
                    {!loading &&
                      tradList
                        .filter((item) => {
                          if (searchValue) return fuzzyMatch(item.name, searchValue)
                          else return true
                        })
                        .filter((item) => {
                          if (searchValue && item.nameTheme) return fuzzyMatch(item.name, searchValue)
                          else return true
                        })
                        .filter((item) => {
                          let obj = nftListStatus.find((item) => item.value === '1')
                          return obj?.active ? item.isSell === true : true
                        })
                        .filter((item) => {
                          if (priceNumStatus) {
                            return item.unit === selectPayActive.label
                          } else return true
                        })
                        .filter((item) => {
                          if (priceNumStatus) {
                            if (priceNum.min && priceNum.max)
                              return (
                                Number(nftData.toWeiFromWei(item.price)) >= priceNum.min &&
                                Number(nftData.toWeiFromWei(item.price)) <= priceNum.max
                              )
                            else if (priceNum.min) return Number(nftData.toWeiFromWei(item.price)) >= priceNum.min
                            else if (priceNum.max) return Number(nftData.toWeiFromWei(item.price)) <= priceNum.max
                            else return true
                          } else return true
                        }).length === 0 && <NoData top={6} />}
                  </NftList>
                </div>

                <div className="pagination-nft">
                  {tradList
                    .filter((item) => {
                      if (searchValue) return fuzzyMatch(item.name, searchValue)
                      else return true
                    })
                    .filter((item) => {
                      if (searchValue && item.nameTheme) return fuzzyMatch(item.name, searchValue)
                      else return true
                    })
                    .filter((item) => {
                      let obj = nftListStatus.find((item) => item.value === '1')
                      return obj?.active ? item.isSell === true : true
                    })
                    .filter((item) => {
                      if (priceNumStatus) {
                        return item.unit === selectPayActive.label
                      } else return true
                    })
                    .filter((item) => {
                      if (priceNumStatus) {
                        if (priceNum.min && priceNum.max)
                          return (
                            Number(nftData.toWeiFromWei(item.price)) >= priceNum.min &&
                            Number(nftData.toWeiFromWei(item.price)) <= priceNum.max
                          )
                        else if (priceNum.min) return Number(nftData.toWeiFromWei(item.price)) >= priceNum.min
                        else if (priceNum.max) return Number(nftData.toWeiFromWei(item.price)) <= priceNum.max
                        else return true
                      } else return true
                    }).length > 0 &&
                    !loading && (
                      <Pagination
                        showTitle={false}
                        current={current}
                        defaultCurrent={current}
                        defaultPageSize={tradePageSize || 16}
                        total={
                          tradList
                            .filter((item) => {
                              if (searchValue) return fuzzyMatch(item.name, searchValue)
                              else return true
                            })
                            .filter((item) => {
                              if (searchValue && item.nameTheme) return fuzzyMatch(item.name, searchValue)
                              else return true
                            })
                            .filter((item) => {
                              let obj = nftListStatus.find((item) => item.value === '1')
                              return obj?.active ? item.isSell === true : true
                            })
                            .filter((item) => {
                              if (priceNumStatus) {
                                return item.unit === selectPayActive.label
                              } else return true
                            })
                            .filter((item) => {
                              if (priceNumStatus) {
                                if (priceNum.min && priceNum.max)
                                  return (
                                    Number(nftData.toWeiFromWei(item.price)) >= priceNum.min &&
                                    Number(nftData.toWeiFromWei(item.price)) <= priceNum.max
                                  )
                                else if (priceNum.min) return Number(nftData.toWeiFromWei(item.price)) >= priceNum.min
                                else if (priceNum.max) return Number(nftData.toWeiFromWei(item.price)) <= priceNum.max
                                else return true
                              } else return true
                            }).length
                        }
                        showSizeChanger={false}
                        onChange={paginationChange}
                      />
                    )}
                </div>
              </TradingFloorContent>
            </Col>
          </Row>
        </>
      )}
      {currentStatus === 'details' && (
        <>
          <TradingFloorTitle active={false}>
            <Title>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCurrentStatus('list')
                  setCurrentDetails(currentDetailsInit)
                  setCurent(1)
                  history.replace('/market')
                }}
              >
                <LeftCircleOutlined style={{ color: '#5746FE' }} />
              </div>
            </Title>
          </TradingFloorTitle>
          <ComLayoutTwo>
            <Row gutter={{ xs: 12, sm: 24, lg: 68 }} className="details-shop">
              <Col span={24} lg={12} md={8} className="details-shop-left">
                <ImageDiv>
                  {(type === '.jpg' || type === '.png' || type === '.gif' || type === '.svg') && (
                    <Image src={currentDetails.image} preview={false} fallback={ImageError}></Image>
                  )}
                  {(type === '.mp4' || type === '.webm') && <video src={currentDetails.image} controls autoPlay loop></video>}
                  {(type === '.mp3' || type === '.wav' || type === '.ogg') && (
                    <audio controls>
                      <source src={currentDetails.image} />
                    </audio>
                  )}
                  {type === '.gltf' && <Modelviewer src={currentDetails.image} />}
                </ImageDiv>
                <DescribeDiv style={{ marginTop: '2.5rem' }}>
                  <h3>{t('market.details.vice.title2')}</h3>
                  <div className="info">
                    <div className="span">{t('market.details.vice.title2.list1')}</div>
                    {formatStrAddress(6, 4, SharedToken_ADDRESS || '')}
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
                  {currentDetails.nameTheme}
                </CurrentThemeDiv>
                <h2>{currentDetails.name}</h2>
                <h4>
                  {t('market.details.theme.hold')}&nbsp;&nbsp;{formatStrAddress(6, 4, currentDetails.address || '')}
                </h4>
                <DescribeDiv>
                  <h3>{t('market.details.price.title')}</h3>
                  {currentDetails.isSell && (
                    <div className="price-content">
                      <PriceDiv style={{ color: nftPriceIconColor[currentDetails.unit || ''] }}>
                        <Image src={nftPriceIcon[currentDetails.unit || '']} width="1.81rem" preview={false}></Image>
                        {nftData.toWeiFromWei(currentDetails.price)}&nbsp;&nbsp;{currentDetails.unit}
                      </PriceDiv>
                      <h5>{t('market.details.price.title.vice')}</h5>
                      {!active && <ConnectWallet status="shop" />}
                      {active && (
                        <Button className="my-home-btn-1 details-btns" onClick={() => buyClcik()}>
                          {t('market.details.price.btn')}
                        </Button>
                      )}
                    </div>
                  )}
                </DescribeDiv>
                <DescribeDiv className="addDes">
                  <div className="info">
                    <div className="span">{t('market.details.vice.title3')}</div>
                    <span style={{ width: '100%', textAlign: 'end' }}>{Number(currentDetails.royalty)}%</span>
                  </div>
                  <div className="info">
                    <div className="span">{t('market.details.vice.title4')}</div>
                    <span style={{ width: '100%', textAlign: 'end' }}>{currentDetails.time}</span>
                  </div>
                </DescribeDiv>
                <DescribeDiv>
                  <h3>{t('market.details.vice.title1')}</h3>
                  {currentDetails.description && (
                    <ul>
                      <li>{currentDetails.description}</li>
                    </ul>
                  )}
                  {!currentDetails.description && (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <NoData top={0} />
                    </div>
                  )}
                </DescribeDiv>
              </Col>
            </Row>
          </ComLayoutTwo>
          <ComLayoutTwo style={{ marginBottom: '2.5rem' }}>
            <Col span={24}>
              <ShopDiv>
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
          </ComLayoutTwo>
        </>
      )}
      {isLoading && <Loading title="Purchasing" />}
    </TradingFloorWrapper>
  )
})
