import React, { memo, useState, useRef } from 'react'
import { CreateContent, TitleTrue, UploadCusDiv, TitleProject } from './styled'
import { Input, Button, Form, Upload, message, Image, InputNumber, Spin } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { getBase64 } from '@/utils'
import { useTranslation } from 'react-i18next'
import { FormInstance } from 'antd/es/form'
import Modelviewer from '@/components/ModelViewer'
import useWeb3StoreHooks from '@/hooks/useWeb3StoreHooks'
import type { StorageClientTypes } from '@/contracts/web3StorageInit'
import type { ConstantInitTypes } from '@/contracts/constantInit'
import useDataHooks from '@/hooks/useDataHooks'
import { useSelector } from 'react-redux'
import { getBytes32FromIpfsHash } from '@/common'
import type { ListType } from '@/hooks/useMyProjectHooks'
import { BigNumber } from 'bignumber.js'

const acceptType = 'image/jpeg,image/png,image/svg+xml,image/gif,video/mp4,video/webm,audio/ogg,audio/wav,audio/mpeg,.gltf'
const acceptTypeCover = 'image/jpeg,image/png,image/gif'

interface Type {
  returnClick: (s: boolean) => void
  programDetails: ListType
}

export default memo(function CreateProjectPage(props: Type) {
  const { programDetails, returnClick } = props

  const web3Store: StorageClientTypes = useWeb3StoreHooks()
  const { client, storeFilesPapers, makeFileObjects } = web3Store
  const nftData: ConstantInitTypes = useDataHooks()
  const { constant } = nftData
  const myAddress = useSelector((state: any) => state.userInfo.address)

  const { t } = useTranslation()
  let formRef = useRef<FormInstance>()

  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState<string>('Loading...')

  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageUrlSource, setImageUrlSource] = useState<string>('')
  const [imageUrlType, setImageUrlType] = useState<any>(undefined)
  const [imageCid, setImageCid] = useState<any>(undefined)

  const [imageUrlCover, setImageUrlCover] = useState<string>('')
  const [imageUrlCoverSource, setImageUrlCoverSource] = useState<string>('')
  const [imageCidCover, setImageCidCover] = useState<any>(undefined)

  const onFinish = async (values: any) => {
    try {
      if (!imageCid) {
        message.warning({
          content: `Image ${t('create.from1.rules')}`,
          className: 'message-global',
        })
        return false
      }
      if (
        (imageUrlType === 'video/mp4' ||
          imageUrlType === 'video/webm' ||
          imageUrlType === 'audio/mpeg' ||
          imageUrlType === 'audio/wav' ||
          imageUrlType === 'audio/ogg' ||
          imageUrlType === '.gltf') &&
        !imageCidCover
      ) {
        message.warning({
          content: `Cover ${t('create.from2.rules')}`,
          className: 'message-global',
        })
        return false
      }
      setLoadingText('Loading')
      setLoading(true)
      console.log('values', values)
      let obj = {
        name: values.name,
        description: values.describe,
        image: imageCid,
        cover: imageCidCover || imageCid,
        coverFiles: imageUrlCoverSource ? imageUrlCoverSource : imageUrlSource,
        imageFiles: imageUrlSource,
      }
      createNftClick(programDetails.value, obj, values)
    } catch (error) {
      console.log('err', error)
      setLoading(false)
    }
  }

  const createNftClick = async (categoriesName: string, nftObj: any, values: any) => {
    try {
      let obj = {
        ...nftObj,
        categoriesName,
        myAddress,
        coverFiles: nftObj.coverFiles,
      }
      let files = await makeFileObjects(obj)
      let data: any = await storeFilesPapers(files, client, 'application/json')
      let namebyte32 = getBytes32FromIpfsHash(data.cid)
      let royaltyFraction = new BigNumber(values.proportion).multipliedBy(100)
      constant.ContractMarketSharedToken.methods
        .safeMint(categoriesName, namebyte32, values.earnAddress, Number(royaltyFraction))
        .send({
          from: myAddress,
        })
        .on('transactionHash', function (hash: any) {
          console.log(hash)
        })
        .on('receipt', async (receipt: any) => {
          message.success({
            content: t('create.message.success'),
            className: 'message-global',
          })
          setLoading(false)
          returnClick(false)
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

  const imageOrBase64 = async (info: any, str: '1' | '2') =>
    getBase64(info, (img: any) => {
      if (str === '1') setImageUrl(img)
      if (str === '2') setImageUrlCover(img)
    })

  const beforeUpload = (file: any, str: '1' | '2') => {
    let isType = false
    if (str === '1') {
      let types = file.name.substring(file.name.length - 5)
      isType =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/svg+xml' ||
        file.type === 'video/mp4' ||
        file.type === 'video/webm' ||
        file.type === 'audio/mpeg' ||
        file.type === 'audio/wav' ||
        file.type === 'audio/ogg' ||
        types === '.gltf'
    }
    if (str === '2') {
      isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
    }

    if (!isType) {
      message.error({
        content: str === '1' ? t('create.message.tips1') : t('create.message.tips3'),
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
    if (isType && isLt100M && str === '1') {
      let types1 = file.name.length > 5 ? (file.name.substring(file.name.length - 5) === '.gltf' ? '.gltf' : file.type) : file.type
      setLoadingText('Uploading...')
      setLoading(true)
      if (client) manualUploadOne(file, types1)
    }
    if (isType && isLt100M && str === '2') {
      let isType2 = file.type
      setLoadingText('Uploading...')
      setLoading(true)
      if (client) manualUploadTwo(file, isType2)
    }
    return false
  }

  const manualUploadOne = async (s: any, type: string) => {
    try {
      let data: any = await storeFilesPapers(s, client, type)
      console.log('image', data)
      setImageCid(data.cid)
      setImageUrlType(type)
      setImageUrlSource(data.url)
      if (type === 'image/jpeg' || type === 'image/png' || type === 'image/gif' || type === 'image/svg+xml') {
        imageOrBase64(s, '1')
      } else {
        setImageUrl(data.url)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const manualUploadTwo = async (s: any, type: string) => {
    try {
      let data: any = await storeFilesPapers(s, client, type)
      console.log('cover', data)
      setImageCidCover(data.cid)
      setImageUrlCoverSource(data.url)
      if (type === 'image/jpeg' || type === 'image/png' || type === 'image/gif' || type === 'image/svg+xml') {
        imageOrBase64(s, '2')
      } else {
        setImageUrlCover(data.url)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
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

  const uploadExhibit = (str: '1' | '2') => (
    <UploadCusDiv>
      {str === '1' && (
        <>
          {(imageUrlType === 'image/jpeg' ||
            imageUrlType === 'image/png' ||
            imageUrlType === 'image/gif' ||
            imageUrlType === 'image/svg+xml') && <Image src={imageUrl} preview={false} height="8.25rem" width="auto"></Image>}
          {(imageUrlType === 'video/mp4' || imageUrlType === 'video/webm') && <video src={imageUrl} controls autoPlay loop></video>}
          {(imageUrlType === 'audio/mpeg' || imageUrlType === 'audio/wav' || imageUrlType === 'audio/ogg') && (
            <audio controls>
              <source src={imageUrl} />
            </audio>
          )}
          {imageUrlType === '.gltf' && <Modelviewer src={imageUrl} />}
        </>
      )}
      {str === '2' && <Image src={imageUrlCover} preview={false} height="8.25rem" width="auto"></Image>}
    </UploadCusDiv>
  )

  return (
    <Spin spinning={loading} tip={loadingText} className="antd-loadings">
      <CreateContent>
        <TitleProject>
          <span style={{ color: '#e6110c' }}>*</span>
          <span>{t('create.from5.label')}:</span>
          {programDetails.name}
        </TitleProject>
        <TitleTrue>
          <span>*</span>
          {t('create.title.f1')}
        </TitleTrue>
        <Form preserve={false} ref={formRef as any} name="create" onFinish={onFinish} initialValues={{ gender: 'new' }} layout="vertical">
          <Form.Item
            label={
              <span>
                <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
                {t('create.from1.label')}
              </span>
            }
            name="image"
            valuePropName="fileList"
            style={{ position: 'relative' }}
            // rules={[{ required: true, message: t('create.from1.rules') }]}
          >
            {imageCid && uploadExhibit('1')}
            <Upload.Dragger
              className="uploader-files"
              name="files"
              beforeUpload={(s) => beforeUpload(s, '1')}
              maxCount={1}
              accept={acceptType}
              showUploadList={false}
            >
              {imageCid ? (
                <Button type="text" size="large" className="modal-btns">
                  {t('create.upload.btn1')}
                </Button>
              ) : (
                uploadButton
              )}
            </Upload.Dragger>
          </Form.Item>
          <TitleTrue>{t('create.from1.f1')}</TitleTrue>
          {(imageUrlType === 'video/mp4' ||
            imageUrlType === 'video/webm' ||
            imageUrlType === 'audio/mpeg' ||
            imageUrlType === 'audio/wav' ||
            imageUrlType === 'audio/ogg' ||
            imageUrlType === '.gltf') && (
            <>
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
              >
                {imageCidCover && uploadExhibit('2')}
                <Upload.Dragger
                  className="uploader-files"
                  name="files"
                  beforeUpload={(s) => beforeUpload(s, '2')}
                  maxCount={1}
                  accept={acceptTypeCover}
                  showUploadList={false}
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
            </>
          )}
          <Form.Item label={t('create.from3.label')} name="name" rules={[{ required: true, message: t('create.from3.rules') }]}>
            <Input placeholder={t('create.from3.placeholder')} maxLength={10} />
          </Form.Item>
          <Form.Item label={t('create.from4.label')} name="describe">
            <Input.TextArea autoSize={{ minRows: 6, maxRows: 8 }} showCount placeholder={t('create.from4.placeholder')} maxLength={200} />
          </Form.Item>
          <TitleTrue>{t('create.from4.f1')}</TitleTrue>
          <Form.Item label={t('create.from6.label')} name="proportion" rules={[{ required: true, message: t('create.from6.rules') }]}>
            <InputNumber
              precision={2}
              min={0}
              max={30}
              placeholder={t('create.from6.placeholder')}
              addonAfter="%"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <TitleTrue>{t('create.from6.f1')}</TitleTrue>
          <Form.Item label={t('create.from7.label')} name="earnAddress" rules={[{ required: true, message: t('create.from7.rules') }]}>
            <Input placeholder={t('create.from7.placeholder')} minLength={48} maxLength={48} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t('create.btn')}
            </Button>
          </Form.Item>
        </Form>
      </CreateContent>
    </Spin>
  )
})
