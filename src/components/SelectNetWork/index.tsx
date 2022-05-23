import React, { memo, useState, useEffect } from 'react'
import { message, Button, Drawer, Image, Col } from 'antd'
import NETWORK_DEFAULT from '@/assets/svg/network_default.svg'
import Select, { components } from 'react-select'
import { CloseOutlined, DownOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { RPC_URLS, netWorks, netWorkInit, defaultChainId, getActiveChainId } from '@/contracts/constant'
import { useSelector, useDispatch } from 'react-redux'
import useDataHooks from '@/hooks/useDataHooks'
import { SaveNetwork } from '@/store/wallet/action'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import type { listTypes as netWorkInitType } from '@/contracts/init'
import { customStyles, SelectNetWorkWrapper, NoChainIdTips, MenusList, DrawerListInfo, SelectMarketWrapper, customStyles1 } from './styled'
import { useWindowSizeHooks } from '@/hooks/useWindowSizeHooks'
import { AdaptFontSize } from '@/utils'

/**
 * switchNetWorksChange -- 直接切换
 * switchNetWorksChangeInjected -- 切换并链接 Metamask (Yes)
 */

interface listType {
  label: string
  value: string
  icon: string
  backgroundImage: string
  img: string
  fullName: string
}

interface Type {
  status?: string
}

export default memo(function SelectNetWorkPage(props: Type) {
  const { status = '' } = props
  const { REACT_APP_ENV = 'prd' } = process.env

  const dataInit: ConstantInitTypes = useDataHooks()
  const { web3 } = dataInit
  const { t } = useTranslation()
  // @ts-ignore
  const { ethereum } = window
  const { i18n } = useTranslation()
  const dispatch = useDispatch()
  const walletInfo = useSelector((state: any) => state.walletInfo)

  const [active, setActive] = useState<boolean>(() => getActiveChainId(RPC_URLS, walletInfo.network))

  const [isMaskOptions, setIsMaskOptions] = useState(false)
  const [optionsActive, setOptionsActive] = useState<listType[]>(() => {
    let list: listType[] = []
    netWorkInit.forEach((item: netWorkInitType) => {
      list.push({
        value: item.chainId,
        label: item.name,
        icon: item.icon,
        backgroundImage: item.backgroundImage,
        img: item.img,
        fullName: item.fullName,
      })
    })
    return list
  })
  const [moveSwitch, setMoveSwitch] = useState(false)

  const [isNetWork, setIsNetWork] = useState<boolean>(() => getActiveChainId(RPC_URLS, walletInfo.network))
  const { windowSize } = useWindowSizeHooks()

  useEffect(() => {
    setIsNetWork(getActiveChainId(RPC_URLS, walletInfo.network))
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletInfo.network])

  useEffect(() => {
    getOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netWorkInit])

  useEffect(() => {
    let isTrue = getActiveChainId(RPC_URLS, walletInfo.network)
    setActive(isTrue)
  }, [walletInfo.network])

  const getOptions = () => {
    let list: listType[] = []
    netWorkInit.forEach((item: netWorkInitType) => {
      list.push({
        value: item.chainId,
        label: item.name,
        icon: item.icon,
        backgroundImage: item.backgroundImage,
        img: item.img,
        fullName: item.fullName,
      })
    })
    setOptionsActive(list)
  }

  /* eslint-disable */
  const switchNetWorksChangeInjected = (objChainId: string | number) => {
    return changeInjectedNetwork(objChainId)
      .then(async () => console.log('success'))
      .catch((error) =>
        message.error({
          content: error.message,
          className: 'message-global',
        }),
      )
  }
  /* eslint-disable */

  const changeInjectedNetwork = (objChainId: any) => {
    return new Promise(async (resolve: any, reject) => {
      // @ts-ignore
      const { ethereum } = window
      if (ethereum && ethereum.isMetaMask && netWorks[objChainId]) {
        let obj: any = netWorks[objChainId]
        if (obj.isSwitch)
          ethereum
            .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: netWorks[objChainId].chainId }] })
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
      } else {
        let currentChainIds = web3.utils.hexToNumber(netWorks[objChainId].chainId)
        dispatch(SaveNetwork(currentChainIds))
        localStorage.setItem('chainId', currentChainIds.toString())
        setIsMaskOptions(false)
        reject()
      }
    })
  }

  const switchNetWorksChange = (objChainId: any) => {
    if (!ethereum) {
      let currentChainIds = web3.utils.hexToNumber(netWorks[objChainId].chainId)
      dispatch(SaveNetwork(currentChainIds))
      localStorage.setItem('chainId', currentChainIds.toString())
    }
    setIsMaskOptions(false)
    setMoveSwitch(false)
    if (ethereum && ethereum.isMetaMask) {
      switchNetWorksChangeInjected(objChainId)
    }
  }

  const switchNetWorkChange = () => {
    ethereum
      .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: netWorks[defaultChainId].chainId }] })
      .then(() => {})
      .catch((err: any) => {})
  }

  const DropdownIndicator = (props: any) => (
    <components.DropdownIndicator {...props}>
      <DownOutlined style={{ color: '#80808B' }} />
    </components.DropdownIndicator>
  )

  const DropdownIndicator1 = (props: any) => (
    <components.DropdownIndicator {...props}>
      <DownOutlined style={{ color: '#5746FE' }} />
    </components.DropdownIndicator>
  )

  const MenuList = (props: any) => {
    return (
      <components.MenuList {...props}>
        {optionsActive.map((item, i) => (
          <MenusList
            key={i}
            onClick={() => switchNetWorksChange(item.value)}
            className={item.value === walletInfo.network ? 'menu-active-wallet' : ''}
          >
            <img src={item.icon} alt="" />
            <div className="network-content">
              <h3>{item.label}</h3>
              <div className="span">{item.fullName}</div>
            </div>
          </MenusList>
        ))}
      </components.MenuList>
    )
  }

  const Control = ({ children, ...props }: any) => {
    return (
      <div
        style={{
          borderRadius: 20,
          // backgroundImage: optionsActive.find((item) => item.value === walletInfo.network)?.backgroundImage,
        }}
        className={!active ? 'no-control' : 'no-control'}
      >
        <components.Control {...props}>
          {optionsActive.find((item) => item.value === walletInfo.network) && (
            <img src={optionsActive.find((item) => item.value === walletInfo.network)?.icon} alt="" className="bjLogo" />
          )}
          {children}
        </components.Control>
      </div>
    )
  }

  const Control1 = ({ children, ...props }: any) => {
    return (
      <div
        style={{
          borderRadius: 10,
          // backgroundImage: optionsActive.find((item) => item.value === walletInfo.network)?.backgroundImage,
        }}
      >
        <components.Control {...props}>
          {optionsActive.find((item) => item.value === walletInfo.network) && (
            <img src={optionsActive.find((item) => item.value === walletInfo.network)?.icon} alt="" className="bjLogo" />
          )}
          {children}
        </components.Control>
      </div>
    )
  }

  const PandaImg = (props: any) => (
    <Button
      type="primary"
      size="large"
      className="wallet-login-icon-h5"
      style={{
        borderColor: active ? 'transparent' : 'none',
        // backgroundImage: optionsActive.find((item) => item.value === walletInfo.network)?.backgroundImage,
      }}
      onClick={() => setMoveSwitch(true)}
      icon={<img {...props} src={active ? optionsActive.find((item) => item.value === walletInfo.network)?.icon : NETWORK_DEFAULT} />}
    >
      <DownOutlined style={{ color: '#80808B', marginLeft: '0.31rem', fontSize: '1rem' }} />
    </Button>
  )

  return (
    <>
      {status === '' && (
        <SelectNetWorkWrapper>
          {windowSize.innerWidth > AdaptFontSize && (
            <Select
              menuIsOpen={isMaskOptions}
              styles={customStyles}
              isSearchable={false}
              options={optionsActive}
              onMenuOpen={() => setIsMaskOptions(true)}
              onMenuClose={() => setIsMaskOptions(false)}
              placeholder={
                i18n.language === 'en'
                  ? REACT_APP_ENV === 'dev'
                    ? '47 Test'
                    : 'Change Network'
                  : REACT_APP_ENV === 'dev'
                  ? '47测试链'
                  : '更换网络'
              }
              value={active ? optionsActive.filter((item) => item.value === walletInfo.network)[0] : ''}
              components={{ DropdownIndicator, MenuList, Control }}
            />
          )}
          {windowSize.innerWidth <= AdaptFontSize && <PandaImg preview={false} />}
          {!isNetWork && !active && ethereum && ethereum.isMetaMask && REACT_APP_ENV !== 'dev' && (
            <NoChainIdTips onClick={() => switchNetWorkChange()}>
              <span>{t('app.no.chainid.tips')}</span>
              <Button className="no-network-btns">{t('app.no.chainid.btn')}</Button>
            </NoChainIdTips>
          )}
          <Drawer
            key="h5"
            placement="bottom"
            title={t('app.chainid.drawer.title')}
            onClose={() => setMoveSwitch(false)}
            visible={moveSwitch}
            className="drawer-mask"
            height="60%"
            closeIcon={<CloseOutlined style={{ color: 'black' }} />}
          >
            {optionsActive.map((item, index) => (
              <DrawerListInfo
                onClick={() => switchNetWorksChange(item.value)}
                key={index}
                className={item.value === walletInfo.network ? 'active-info' : ''}
              >
                <Image src={item.icon} preview={false} />
                <div className="network-content">
                  <h3>{item.label}</h3>
                  <span>{item.fullName}</span>
                </div>
              </DrawerListInfo>
            ))}
          </Drawer>
        </SelectNetWorkWrapper>
      )}{' '}
      {status === 'Market' && (
        <SelectMarketWrapper>
          <Col span={20}>
            <Select
              menuIsOpen={isMaskOptions}
              styles={customStyles1}
              isSearchable={false}
              options={optionsActive}
              onMenuOpen={() => setIsMaskOptions(true)}
              onMenuClose={() => setIsMaskOptions(false)}
              placeholder={
                i18n.language === 'en'
                  ? REACT_APP_ENV === 'dev'
                    ? '47 Test'
                    : 'Change Network'
                  : REACT_APP_ENV === 'dev'
                  ? '47测试链'
                  : '更换网络'
              }
              value={active ? optionsActive.filter((item) => item.value === walletInfo.network)[0] : ''}
              components={{ DropdownIndicator: DropdownIndicator1, MenuList, Control: Control1 }}
            />
          </Col>
        </SelectMarketWrapper>
      )}
    </>
  )
})
