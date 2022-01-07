import React, { Component } from 'react'
import { Upload, Icon, Modal, notification } from 'antd'
import { getBase64 } from '@/utils'
import { UPLOAD_URL } from '@/utils/global'
import PropTypes from 'prop-types'
export default class ImageUploader extends Component {
  constructor(props) {
    super(props)
    let fileList = []
    if (props.value) {
      let value = typeof props.value === 'string' ? [props.value] : props.value
      value.forEach((url, i) => {
        url &&
          fileList.push({
            uid: -i,
            status: 'done',
            url,
          })
      })
    }

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList,
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => {
    if (this.props.onChange && !fileList.some(({ status }) => status === 'uploading')) {
      let _fl = []
      fileList?.forEach((item, i) => {
        let { status, response: r, url } = item
        if (status === 'error' || (r && r.code !== 200)) {
          notification.error({
            message: '图片上传失败',
            description: `图片名为：${item.name || ''} 上传失败,已自动移除,请重试`,
          })
          fileList.splice(i, 1)
          this.setState({ fileList })
          return
        } else {
          _fl.push(url || r.data)
        }
      })
      this.props.onChange(this.props.limit > 1 ? _fl : _fl[0] || '')
    }
    this.setState({ fileList })
  }

  beforeUpload = ({ size, type }) => {
    if (type && !/^image/.test(type)) {
      notification.warning({
        key: 'updatable',
        message: '仅支持上传图片',
      })
      return false
    } else if (size >= this.props.maxSize) {
      notification.warning({
        key: 'updatable',
        message: '图片过大，无法上传',
      })
      return false
    } else {
      let accpet = type.split('/')[1]
      if (this.props.accept && !this.props.accept.includes(accpet)) {
        notification.warning({
          key: 'updatable',
          message: '图片格式不支持',
        })
        return false
      }
    }
    return true
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const p = this.props
    const uploadButton = (
      <>
        <Icon type='plus' />
        <div className='ant-upload-text'>{p.btnText}</div>
      </>
    )
    return (
      <>
        <div className='clearfix'>
          <Upload
            action={UPLOAD_URL}
            listType='picture-card'
            accept={p.accept}
            fileList={fileList}
            beforeUpload={this.beforeUpload}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= p.limit ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt='' style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
        <div style={{ lineHeight: '2em', fontSize: '12px', color: '#909399' }}>{p.tips}</div>
      </>
    )
  }
}

ImageUploader.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  limit: PropTypes.number,
  accept: PropTypes.string,
  btnText: PropTypes.string,
  tips: PropTypes.node,
  maxSize: PropTypes.number,
  onChange: PropTypes.func,
}

ImageUploader.defaultProps = {
  limit: 1,
  accept: '.bmp,.png,.jpeg,.jpg',
  btnText: '',
  tips: '图片大小不超过10M，支持格式：bmp，png，jpeg，jpg',
  maxSize: 1024 * 1024 * 10,
}
