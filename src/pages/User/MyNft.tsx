import React, { memo, useState, useEffect } from 'react'
import { Pagination, Row, Col, Spin, message } from 'antd'
import { UserMyNftWrapper, TitleVice, StateList, NftList } from './MyNftStyled'
import { MyProjectTitle, MyProjectWrapper } from './MyProjectStyled'
import { UserHomeTitle, Title } from './InformationStyled'
import { Link } from 'react-router-dom'
import { LeftCircleOutlined } from '@ant-design/icons'
import { statusOptions } from '@/contracts/init'
import { useMyNftHooks } from '@/hooks/useMyNftHooks'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import Card from '@/components/Card'
import NoData from '@/components/NoData'
import useDataHooks from '@/hooks/useDataHooks'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import { ComLayoutTwo } from '@/common/styled'
import CreateDetailsModal from '@/components/CreateDetailsModal'
import type { CardType } from '@/common/data'
import { useHistory } from 'react-router-dom'
import { useFeeUpdatedHooks } from '@/hooks/useFeeUpdatedHooks'
import { SaveLoading } from '@/store/wallet/action'

const currentDetailsInit1: CardType = {
  tokenId: '',
  name: '',
  image: '',
  serialNumber: 0,
}

export default memo(function UserMyNftPage(props: any) {
  const { t } = useTranslation()
  let history = useHistory()

  const dispatch = useDispatch()
  const isRefreshDataRedux = useSelector((state: any) => state.walletInfo.loading)
  const BallKingData: ConstantInitTypes = useDataHooks()
  const { myNftPageSize } = BallKingData

  const [activeStatus, setActiveStatus] = useState<string>('')
  const [current, setCurent] = useState(1)
  const [isRefreshData, setIsRefreshData] = useState(false)

  const myAddress = useSelector((state: any) => state.userInfo.address)
  const { myNftList, loading } = useMyNftHooks({ myAddress, isRefreshData })

  const [spinLoading, setSpinLoading] = useState(false)
  const [loadingText, setLoadingText] = useState<string>('Loading...')

  const { serviceCharge } = useFeeUpdatedHooks()

  const [currentStatus, setCurrentStatus] = useState<'list' | 'details'>('list')
  const [currentDetails1, setCurrentDetails1] = useState<CardType>(currentDetailsInit1)

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const search = props.location.search
    historySearchSwitch(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, myNftList])

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
      console.log(list)
      if (list[0].lable === 'project' && list[0].value && myNftList.length !== 0) {
        let data = myNftList.filter((item) => item.serialNumber === list[0].value)
        if (data.length === 0) {
          message.error({
            content: t('myproject.message.tips'),
            className: 'message-global',
          })
          setTimeout(() => {
            history.replace('/mynft')
          }, 500)
          return false
        }
        setCurrentStatus('details')
        setCurrentDetails1(data[0])
      } else if (list[0].lable === 'key' && list[0].value === 'create') {
        dispatch(SaveLoading(!isRefreshDataRedux))
        setTimeout(() => {
          history.replace('/mynft')
        }, 100)
      } else {
        setCurrentStatus('list')
      }
    } else {
      setCurrentStatus('list')
    }
  }

  const paginationChange = (page: any, pageSize: any) => setCurent(page)

  return (
    <Spin spinning={spinLoading} tip={loadingText} className="antd-loadings">
      <UserMyNftWrapper>
        <UserHomeTitle>
          <Title>
            <Link to={'/mynft'}>{t('mynft.title')}</Link>
          </Title>
        </UserHomeTitle>
        {myAddress && (
          <>
            {currentStatus === 'list' && (
              <ComLayoutTwo>
                <div className="content-nft">
                  <Row gutter={[30, 0]}>
                    <Col span={24} md={{ span: 6 }}>
                      <StateList>
                        {statusOptions.map((item, i) => (
                          <div
                            className={item.value === activeStatus ? 'span active' : 'span'}
                            key={i}
                            onClick={() => {
                              setActiveStatus(item.value)
                              setCurent(1)
                            }}
                          >
                            {item.lable}
                          </div>
                        ))}
                      </StateList>
                    </Col>
                    <Col span={24} md={{ span: 18 }}>
                      <TitleVice>
                        <div className="titlesssssss">
                          {activeStatus === '' && <>{t('mynft.title.vice')}&nbsp;&nbsp;</>}
                          {activeStatus === '1' && <>{t('mynft.title.vice2')}&nbsp;&nbsp;</>}
                          {activeStatus === '2' && <>{t('mynft.title.vice3')}&nbsp;&nbsp;</>}
                          <span>
                            {
                              myNftList.filter((item) => {
                                if (activeStatus === '') {
                                  return item.isSell !== true
                                } else {
                                  if (activeStatus === '2') return item.status === activeStatus && item.isSell !== true
                                  else return item.status === activeStatus
                                }
                              }).length
                            }
                          </span>
                          {activeStatus === '' && (
                            <>
                              &nbsp;&nbsp;{t('mynft.title.vice.unit')}&nbsp;&nbsp;NFT&nbsp;&nbsp;{t('mynft.title.vice.s')}
                            </>
                          )}
                          {activeStatus === '1' && <>&nbsp;&nbsp;{t('mynft.title.vice2.unit')}</>}
                          {activeStatus === '2' && <>&nbsp;&nbsp;{t('mynft.title.vice3.unit')}</>}
                        </div>
                      </TitleVice>
                      <NftList>
                        {!loading && (
                          <>
                            {myNftList
                              .filter((item) => {
                                if (activeStatus === '') {
                                  return item.isSell !== true
                                } else {
                                  return item.status === activeStatus
                                }
                              })
                              .filter((item, i) => i < current * (myNftPageSize || 8) && i >= (current - 1) * (myNftPageSize || 8))
                              .map((item, i) => (
                                <div key={i} className="content-nft-info">
                                  <Card
                                    details={item}
                                    keys="mynft"
                                    serviceCharge={serviceCharge}
                                    returnBuyClcik={(s) => {}}
                                    returnClick={(s) => history.replace(`/mynft?project=${s.serialNumber}`)}
                                    returnRefreshData={() => setIsRefreshData(!isRefreshData)}
                                    setLoading={(s) => setSpinLoading(s)}
                                    setLoadingText={(s) => setLoadingText(s)}
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
                          myNftList.filter((item) => {
                            if (activeStatus === '') {
                              return item.isSell !== true
                            } else {
                              return item.status === activeStatus
                            }
                          }).length === 0 && <NoData />}
                      </NftList>
                      <div className="pagination-nft">
                        {myNftList.filter((item) => {
                          if (activeStatus === '') {
                            return item.isSell !== true
                          } else {
                            return item.status === activeStatus
                          }
                        }).length > 0 &&
                          !loading && (
                            <Pagination
                              showTitle={false}
                              defaultCurrent={current}
                              current={current}
                              defaultPageSize={myNftPageSize || 8}
                              total={
                                myNftList.filter((item) => {
                                  if (activeStatus === '') {
                                    return item.isSell !== true
                                  } else {
                                    return item.status === activeStatus
                                  }
                                }).length
                              }
                              showSizeChanger={false}
                              onChange={paginationChange}
                            />
                          )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </ComLayoutTwo>
            )}
            {currentStatus === 'details' && (
              <MyProjectWrapper className="mynft-details">
                <MyProjectTitle>
                  <Title>
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setCurrentStatus('list')
                        history.replace('/mynft')
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
                    history.replace(`/mynft`)
                  }}
                  serviceCharge={serviceCharge}
                />
              </MyProjectWrapper>
            )}
          </>
        )}
      </UserMyNftWrapper>
    </Spin>
  )
})
