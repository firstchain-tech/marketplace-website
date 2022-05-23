import React, { memo, useState, useRef } from 'react'
import { CreateContent, TitleTrue, UploadCusDiv } from './styled'
import { Input, Button, Form, Col, Row, Upload, message, Image } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { getBase64 } from '@/utils'
import { useTranslation } from 'react-i18next'
import { FormInstance } from 'antd/es/form'
import Loading from '@/components/Loading'
import useWeb3StoreHooks from '@/hooks/useWeb3StoreHooks'
import type { StorageClientTypes } from '@/contracts/web3StorageInit'
import { useSelector } from 'react-redux'
import { getBytes32FromIpfsHash } from '@/common'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'

const acceptTypeCover = 'image/jpeg,image/png,image/gif'

interface Type {
  returnClick: (s: boolean) => void
}

export default memo(function CreateOrEditPage(props: Type) {
  const { returnClick } = props
  const web3Store: StorageClientTypes = useWeb3StoreHooks()
  const { client, storeFilesPapers, makeFileObjects } = web3Store
  const myAddress = useSelector((state: any) => state.userInfo.address)

  const nftData: ConstantInitTypes = useDataHooks()
  const { constant } = nftData

  const { t } = useTranslation()
  let formRef = useRef<FormInstance>()

  const [imageUrlCover, setImageUrlCover] = useState<string>('')
  const [imageCidCover, setImageCidCover] = useState<any>(undefined)
  const [imageUrlCoverSource, setImageUrlCoverSource] = useState<string>('')
  const [uploading, setUploading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const onFinish = async (values: any) => {
    try {
      console.log('imageCidCover', imageCidCover)
      if (!imageCidCover) {
        message.warning({
          content: `Cover ${t('create.from2.rules')}`,
          className: 'message-global',
        })
        return false
      }
      console.log(values)
      setLoading(true)
      let obj = {
        name: values.name,
        cover: imageCidCover,
        coverFiles: imageUrlCoverSource,
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
      let files = makeFileObjects(params)
      let data: any = await storeFilesPapers(files, client, 'application/json')
      console.log('cover', data)
      let namebyte32 = getBytes32FromIpfsHash(data.cid)
      constant.ContractCategories.methods
        .add(namebyte32)
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
            returnClick(false)
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
      setUploading(true)
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
      setUploading(false)
    } catch (error) {
      console.log(error)
      setUploading(false)
    }
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
    <CreateContent>
      <Row>
        <Col span={24}>
          <TitleTrue>
            <span>*</span>
            {t('create.title.f1')}
          </TitleTrue>
          <Form preserve={false} ref={formRef as any} name="create" onFinish={onFinish} layout="vertical">
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
              <Input placeholder={t('create.from3.placeholder')} maxLength={10} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {t('create.btn')}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      {uploading && <Loading title="Uploading" />}
      {loading && <Loading />}
    </CreateContent>
  )
})
