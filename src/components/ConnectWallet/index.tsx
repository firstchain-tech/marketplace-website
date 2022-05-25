import React, { memo, useEffect, useState, useRef } from 'react'
import {
  ConnectWalletWrapper,
  ModalTitle,
  WalletTitleAddress,
  StyledNavLink,
  AccountMoveWrapper,
  AccountContent,
  WalletDivCreate,
  DivTest,
} from './styled'
import { Button, Image, Row, Col, Modal, Divider, message, Drawer, Spin } from 'antd'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useDispatch, useSelector } from 'react-redux'
import { SetActivaing } from '@/store/connector/action'
import { connectorsByName, defaultChainId, getActiveChainId, RPC_URLS, netWorkInit } from '@/contracts/constant'
import { useTranslation } from 'react-i18next'
import { formatStrAddress, AdaptFontSize } from '@/utils'
import { netWorks } from '@/contracts/constant'
import { SaveIsLogin, SaveWallet, SaveNetwork } from '@/store/wallet/action'
import { walletInit } from '@/contracts/init'
import { getErrorMessage } from '@/hooks/useErrorHooks'
import { SaveAddress } from '@/store/user/action'
import { CheckCircleFilled, CloseOutlined, WalletOutlined } from '@ant-design/icons'
import { useWindowSizeHooks } from '@/hooks/useWindowSizeHooks'
import { useHistory } from 'react-router-dom'

interface Type {
  status?: string
}

export default memo(function ConnectWalletPage(props: Type) {
  const { REACT_APP_ENV = 'prd' } = process.env
  // @ts-ignore
  const { ethereum } = window
  let history = useHistory()
  const modalRef = useRef<any>(null)

  const { status = '' } = props

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [onShow, setOnShow] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const context = useWeb3React<Web3Provider>()
  const { activate, active, error, library, deactivate, account } = context

  const walletInfo = useSelector((state: any) => state.walletInfo)
  const myAddress = useSelector((state: any) => state.userInfo.address)

  const [moveSwitch, setMoveSwitch] = useState(false)
  const [isNetWork, setIsNetWork] = useState<boolean>(() => getActiveChainId(RPC_URLS, walletInfo.network))
  const { windowSize } = useWindowSizeHooks()

  useEffect(() => {
    setIsNetWork(getActiveChainId(RPC_URLS, walletInfo.network))
    return setIsNetWork(getActiveChainId(RPC_URLS, walletInfo.network))
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletInfo.network])

  useEffect(() => {
    setMoveSwitch(false)
    return setMoveSwitch(false)
  }, [active])

  useEffect(() => {
    setLoading(false)
    if (active) setOnShow(false)
    if (!active) {
      dispatch(SaveIsLogin(false))
      dispatch(SaveWallet('NetWork'))
      dispatch(SaveAddress(''))
      localStorage.removeItem('isLogin')
      localStorage.removeItem('wallet')
      // let pathname = history.location.pathname
      // if (pathname === '/information' || pathname === '/mynft' || pathname === '/myproject') {
      //   history.replace('/home')
      // }
    }
    return () => {
      setLoading(false)
      setOnShow(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, error, library])

  useEffect(() => {
    if (account) dispatch(SaveAddress(account))
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const onConnect = async ({ src }: any) => {
    const currentConnector = connectorsByName[src]
    if (src === 'Injected') {
      dispatch(SetActivaing(currentConnector))
      setInjectedNetWorks(walletInfo.network)
      return false
    } else if (src === 'WalletConnect') {
      activate(
        connectorsByName['WalletConnect']({ [walletInfo.network]: RPC_URLS[walletInfo.network] }, walletInfo.network),
        undefined,
        true,
      )
        .then(() => {
          setLoading(false)
          dispatch(SaveIsLogin(true))
          dispatch(SaveWallet(src))
          localStorage.setItem('wallet', src)
          localStorage.setItem('isLogin', 'true')
          message.success({
            content: t('app.link.suceess'),
            className: 'message-global',
          })
        })
        .catch(async (error) => {
          let msg = getErrorMessage(error)
          await deactivate()
          message.error({
            content: msg,
            className: 'message-global',
          })
          setLoading(false)
          connectorsByName[src].walletConnectProvider = undefined
        })
    } else {
      activate(connectorsByName[src], undefined, true)
        .then(() => {
          setLoading(false)
          dispatch(SaveIsLogin(true))
          dispatch(SaveWallet(src))
          localStorage.setItem('wallet', src)
          localStorage.setItem('isLogin', 'true')
          message.success({
            content: t('app.link.suceess'),
            className: 'message-global',
          })
        })
        .catch(async (error) => {
          let msg = getErrorMessage(error)
          await deactivate()
          message.error({
            content: msg,
            className: 'message-global',
          })
          setLoading(false)
          if (src === 'WalletConnect') connectorsByName[src].walletConnectProvider = undefined
        })
    }
  }

  const setInjectedNetWorks = (objChainId: string | number) => {
    return changeInjectedNetwork(objChainId)
      .then(async () => await activeInjectedChange())
      .catch((error) => {
        console.log('err', error.message)
        message.error({
          content: error.message,
          className: 'message-global',
        })
        setLoading(false)
      })
  }

  const changeInjectedNetwork = (objChainId: any) => {
    return new Promise(async (resolve: any, reject) => {
      // @ts-ignore
      const { ethereum } = window
      let obj: any = isNetWork ? netWorks[objChainId] : netWorks[defaultChainId]
      if (ethereum && ethereum.isMetaMask && obj) {
        if (obj.isSwitch)
          ethereum
            .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: obj.chainId }] })
            .then(() => setTimeout(resolve, 500))
            .catch((err: any) => reject(err))
        else
          ethereum
            .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: obj.chainId }] })
            .then(() => setTimeout(resolve, 500))
            .catch((switchError: any) => {
              if (switchError.code === 4902)
                ethereum
                  .request({ method: 'wallet_addEthereumChain', params: [netWorks[objChainId]] })
                  .then(() => setTimeout(resolve, 500))
                  .catch((err: any) => reject(err))
              else reject(switchError)
            })
      } else resolve()
    })
  }

  const activeInjectedChange = async () => {
    activate(connectorsByName['Injected'], undefined, true)
      .then(() => {
        dispatch(SaveIsLogin(true))
        dispatch(SaveWallet('Injected'))
        setLoading(false)
        localStorage.setItem('wallet', 'Injected')
        localStorage.setItem('isLogin', 'true')
        message.success({
          content: t('app.link.suceess'),
          className: 'message-global',
        })
      })
      .catch(async (error) => {
        let msg = getErrorMessage(error)
        await deactivate()
        setLoading(false)
        message.error({
          content: msg,
          className: 'message-global',
        })
      })
  }

  /** choose Wallet */
  const switchWalletConnect = async (src: any) => {
    onConnect({ src })
    setLoading(true)
  }

  const switchNetWork = (str: any) => {
    localStorage.setItem('chainId', str)
    dispatch(SaveNetwork(str))
  }

  const loginOut = async () => {
    await deactivate()
    dispatch(SaveIsLogin(false))
    dispatch(SaveAddress(''))
    dispatch(SaveWallet('NetWork'))
    localStorage.removeItem('isLogin')
    localStorage.removeItem('wallet')
    localStorage.removeItem('currentConnector')
    message.info({
      content: t('app.link.disconnect'),
      className: 'message-global',
    })
    let pathname = history.location.pathname
    if (pathname === '/information' || pathname === '/mynft' || pathname === '/myproject') {
      history.replace('/home')
    }
  }

  const OnMouseOverDome = () => {
    return (
      <AccountMoveWrapper>
        <div style={{ width: '100%', height: '0.75rem' }}></div>
        <AccountContent>
          <StyledNavLink to={'/information'}>{t('app.my.title1')}</StyledNavLink>
          <StyledNavLink to={'/mynft'}>{t('app.my.title2')}</StyledNavLink>
          <StyledNavLink to={'/myproject'}>{t('app.my.title4')}</StyledNavLink>
          <StyledNavLink to={{}} onClick={() => loginOut()}>
            {t('app.my.title3')}
          </StyledNavLink>
        </AccountContent>
      </AccountMoveWrapper>
    )
  }

  const OnMouseOverH5Dome = () => {
    return (
      <Drawer
        key="h5"
        className="drawer-account"
        placement="bottom"
        onClose={() => setMoveSwitch(false)}
        visible={moveSwitch}
        height="50%"
        closeIcon={<CloseOutlined style={{ color: 'black' }} />}
      >
        <div className="drawer-content">
          <StyledNavLink to={'/information'} onClick={() => setMoveSwitch(false)}>
            {t('app.my.title1')}
          </StyledNavLink>
          <StyledNavLink to={'/mynft'} onClick={() => setMoveSwitch(false)}>
            {t('app.my.title2')}
          </StyledNavLink>
          <StyledNavLink to={'/myproject'} onClick={() => setMoveSwitch(false)}>
            {t('app.my.title4')}
          </StyledNavLink>
          <StyledNavLink to={{}} onClick={() => loginOut()}>
            {t('app.my.title3')}
          </StyledNavLink>
        </div>
      </Drawer>
    )
  }

  const WalletDiv = () => (
    <>
      <h2>{t('app.link.modal.title')}</h2>
      <Divider plain dashed className="gray"></Divider>
      <Row gutter={[16, 32]}>
        <Col span={24}>
          <ModalTitle>
            {t('app.link.modal.ftitle1')}
            <div className="span">1</div>
            <Row style={{ padding: '1.25rem 0 0 0' }}>
              {netWorkInit.map((item: any, index: number) => (
                <Col span={12} className="choose-info" md={{ span: 6 }} key={index} onClick={() => switchNetWork(item.chainId)}>
                  <Image width={60} height={60} src={item.icon} preview={false} style={{ borderRadius: '100%' }} />
                  <span className="choose-span">{item.name}</span>
                  {item.chainId === walletInfo.network && (
                    <div className="choose-icon">
                      <CheckCircleFilled />
                    </div>
                  )}
                </Col>
              ))}
            </Row>
          </ModalTitle>
        </Col>
        <Col span={24}>
          <ModalTitle>
            {t('app.link.modal.ftitle2')}
            <div className="span">2</div>
            <Row style={{ padding: '20px 0 0 0' }}>
              {walletInit
                .filter((item) => {
                  if (!ethereum) return item.name !== 'Metamask'
                  return true
                })
                .map((item, index) => (
                  <Col span={12} className="choose-info" md={{ span: 6 }} key={index} onClick={() => switchWalletConnect(item.link)}>
                    <Image width={60} height={60} src={item.icon} preview={false} style={{ borderRadius: '100%' }} />
                    <span className="choose-span">{item.name}</span>
                  </Col>
                ))}
            </Row>
          </ModalTitle>
        </Col>
        {REACT_APP_ENV === 'dev' && (
          <Col span={24}>
            <DivTest>
              <span>*</span>
              {t('app.link.test.tips')}
            </DivTest>
          </Col>
        )}
      </Row>
    </>
  )

  return (
    <ConnectWalletWrapper className="connect-wallet" ref={modalRef}>
      {!active && status === 'create' && (
        <WalletDivCreate>
          <WalletDiv />
        </WalletDivCreate>
      )}
      {!active && status === 'shop' && (
        <Button className="my-home-btn-1 details-btns" title={t('app.link.title')} onClick={() => setOnShow(true)}>
          {t('app.link.title')}
        </Button>
      )}
      {!active && status === 'buynow' && (
        <Button className="buy-now-btn" title={t('app.link.title')} onClick={() => setOnShow(true)}>
          {t('app.link.title')}
        </Button>
      )}
      {active && myAddress && windowSize.innerWidth >= AdaptFontSize && (
        <WalletTitleAddress onMouseEnter={() => setMoveSwitch(true)} onMouseLeave={() => setMoveSwitch(false)}>
          <span style={{ marginLeft: '1.05rem', marginRight: '0.63rem' }}>{formatStrAddress(6, 4, myAddress)}</span>
          <WalletOutlined />
          {moveSwitch && <OnMouseOverDome />}
        </WalletTitleAddress>
      )}
      {active && myAddress && window.innerWidth < AdaptFontSize && (
        <>
          <WalletTitleAddress onClick={() => setMoveSwitch(true)}>
            <span>{formatStrAddress(6, 4, myAddress)}</span>
            <WalletOutlined />
          </WalletTitleAddress>
          <OnMouseOverH5Dome />
        </>
      )}
      {!active && status === '' && (
        <Button size="large" icon={<WalletOutlined />} className="wallet-login-btn" type="text" onClick={() => setOnShow(true)} />
      )}
      {windowSize.innerWidth > AdaptFontSize && (
        <Modal
          visible={onShow}
          style={{ borderRadius: '0.63rem' }}
          footer={null}
          onCancel={() => setOnShow(false)}
          width="36.88rem"
          wrapClassName="wallets"
          centered
          getContainer={modalRef.current}
        >
          <Spin spinning={loading} tip="Loading...">
            <WalletDiv />
          </Spin>
        </Modal>
      )}
      {windowSize.innerWidth <= AdaptFontSize && (
        <Drawer
          key="wallet-h5"
          placement="bottom"
          title={t('app.link.modal.title')}
          onClose={() => setOnShow(false)}
          visible={onShow}
          className="drawer-mask drawer-mask-wallet"
          height="60%"
          closeIcon={<CloseOutlined style={{ color: 'black' }} />}
        >
          <Row>
            <Col span={24}>
              <ModalTitle>
                {t('app.link.modal.ftitle1')}
                <div className="span">1</div>
                <Row style={{ padding: '1.25rem 0 0 0' }}>
                  {netWorkInit.map((item: any, index: number) => (
                    <Col span={12} className="choose-info" md={{ span: 6 }} key={index} onClick={() => switchNetWork(item.chainId)}>
                      <Image width={60} height={60} src={item.icon} preview={false} style={{ borderRadius: '100%' }} />
                      <span className="choose-span">{item.name}</span>
                      {item.chainId === walletInfo.network && (
                        <div className="choose-icon">
                          <CheckCircleFilled />
                        </div>
                      )}
                    </Col>
                  ))}
                </Row>
              </ModalTitle>
            </Col>
            <Col span={24}>
              <ModalTitle>
                {t('app.link.modal.ftitle2')}
                <div className="span">2</div>
                <Row style={{ padding: '20px 0 0 0' }}>
                  {walletInit
                    .filter((item) => {
                      if (!ethereum) return item.name !== 'Metamask'
                      return true
                    })
                    .map((item, index) => (
                      <Col span={12} className="choose-info" md={{ span: 6 }} key={index} onClick={() => switchWalletConnect(item.link)}>
                        <Image width={60} height={60} src={item.icon} preview={false} style={{ borderRadius: '100%' }} />
                        <span className="choose-span">{item.name}</span>
                      </Col>
                    ))}
                </Row>
              </ModalTitle>
            </Col>
            {REACT_APP_ENV === 'dev' && (
              <Col span={24}>
                <DivTest>
                  <span>*</span>
                  {t('app.link.test.tips')}
                </DivTest>
              </Col>
            )}
          </Row>
        </Drawer>
      )}
    </ConnectWalletWrapper>
  )
})
