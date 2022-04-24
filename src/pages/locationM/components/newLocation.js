import { Form, Button, Input, Cascader, AutoComplete, message } from 'antd'
import React, { Component } from 'react'
import TimeGroupSelect from '@/components/TimeGroupSelect'
import AreaJson from '@/utils/area.json'
import TxMap from '@/components/TxMap'
import ImageUploader from '@/components/ImageUploader'
import { addressSearch } from '@/apis/global'
import { debounce } from '@/utils/index'
import { resJudge } from '@/utils/global'
import { phoneReg } from '@/utils/reg'
import { addLData, updateLData } from '@/apis/location'

class newLocation extends Component {
  constructor(props) {
    super(props)
    let dataSource = {}
    let addressObj = {}
    if (props.dataSource) {
      dataSource = { ...props.dataSource }
      let addressJson = {}
      try {
        addressJson = JSON.parse(props.dataSource.addressJson)
        addressObj = addressJson
        dataSource.areaData = addressJson?.areaId
        dataSource.address = addressJson?.address
        // console.log(dataSource)
      } catch (error) {}
      if (props.dataSource?.latitude && props.dataSource?.latitude) {
        dataSource.coords = [props.dataSource.latitude, props.dataSource.longitude]
      }
    }

    this.state = {
      addressGroup: [],
      btnLoading: false,
      addressObj,
      dataSource,
    }
  }

  //场所时间安排验证
  locationTimeValidator = (_, obj, callback) => {
    if (obj?.some((item) => !item.week || !item.startTime || !item.endTime || item.startTime >= item.endTime)) {
      callback('请完善时间排期内容, 且结束时间必须大于开始时间')
    } else if (obj && obj.length > 1) {
      let weekArr = new Set()
      obj?.forEach((item) => item.week && weekArr.add(item.week))
      weekArr.size !== obj.length ? callback('请检查时间排期，每天只能安排一个时段') : callback()
      weekArr = null
    } else callback()
  }

  handleSubmit = (e) => {
    e.preventDefault()

    this.setState({ btnLoading: true })
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let address = values.address
        let addressJson = JSON.stringify({ ...this.state.addressObj, address })
        values.address = this.state.addressObj.areaData?.join('') + address
        values.addressJson = addressJson
        values.latitude = values.coords[0]?.toString()
        values.longitude = values.coords[1]?.toString()
        if (this.state.dataSource?.id) {
          values.id = this.state.dataSource.id
        }

        let r = await (this.state.dataSource?.id ? updateLData(values) : addLData(values))
        if (resJudge(r)) {
          message.success('操作成功')
          setTimeout(() => {
            this.props.hideModal()
          }, 1000)
          this.props.refresh && this.props.refresh()
        }
      } else {
        message.warning('请完善表单内容')
      }
      this.setState({ btnLoading: false })
    })
  }

  handleReset = () => this.props.hideModal()

  //处理省市区，封装成对应json格式
  handleAreaData = (areaId, options) => {
    let areaData = []
    for (let i = 0; i < options.length; i++) {
      areaData.push(options[i]?.label || '')
    }
    this.setState({
      addressObj: { areaData, areaId },
    })
  }

  //地理位置推荐
  addressSearch = debounce(async (val) => {
    let areaCode = this.props.form.getFieldValue('areaData')
    let addressGroup = []
    if (areaCode && areaCode[areaCode.length - 1] && val) {
      let r = await addressSearch(val, areaCode[areaCode.length - 1])
      if (r && r.status === 0 && r.data) {
        for (let i = 0; i < r.data.length; i++) {
          const { title: text, location } = r.data[i]
          addressGroup.push({ text, value: i.toString(), location })
        }
      }
    }
    this.setState({ addressGroup })
  }, 1500)

  addressSelected = (_, { key }) => {
    let coords = []
    let { addressGroup } = this.state

    for (let i = 0; i < addressGroup.length; i++) {
      const ele = addressGroup[i]
      if (ele.value === key) {
        let { lat, lng } = ele.location
        coords = [lat, lng]
        this.props.form.setFieldsValue({ address: ele.text })
        this.setState({ addressGroup: [] })
        break
      }
    }
    coords.length === 2 && this.props.form.setFieldsValue({ coords })
  }

  render() {
    const tailFormItemLayout = {
      wrapperCol: { span: 16, offset: 4 },
    }
    const formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    let { getFieldDecorator, getFieldsValue } = this.props.form
    let { dataSource: p } = this.state
    let { state: t } = this
    let { areaData, address } = getFieldsValue(['areaData', 'address'])

    return (
      <Form {...formLayout} onSubmit={this.handleSubmit}>
        <Form.Item label='学习场所名称：'>
          {getFieldDecorator('name', {
            rules: [{ required: true, min: 3, max: 16, message: '请输入场所名称' }],
            initialValue: p?.name,
          })(<Input placeholder='请输入名称，3-16个字符' style={{ maxWidth: 300 }} />)}
        </Form.Item>
        <Form.Item label='场所简介：'>
          {getFieldDecorator('introduction', {
            rules: [{ required: true, min: 3, max: 200, message: '请输入简介，3-200个字符' }],
            initialValue: p?.introduction,
          })(<Input.TextArea placeholder='请输入简介，3-200个字符' style={{ maxWidth: '70%' }} />)}
        </Form.Item>
        <Form.Item label='上课日期'>
          {getFieldDecorator('openTimeList', {
            rules: [
              { required: true, type: 'array', min: 1, message: '请填写上课排期' },
              { validator: this.locationTimeValidator },
            ],
            initialValue: p?.openTimeList,
          })(<TimeGroupSelect />)}
        </Form.Item>
        <Form.Item label='联系方式：'>
          {getFieldDecorator('mobile', {
            rules: [
              { required: true, message: '请输入手机号' },
              { pattern: phoneReg, message: '请输入正确格式手机号' },
            ],
            initialValue: p?.mobile,
          })(<Input placeholder='请输入手机号，11位' style={{ maxWidth: 300 }} />)}
        </Form.Item>
        <Form.Item label='场所地区：'>
          {getFieldDecorator('areaData', {
            rules: [{ required: true, message: '请选择省市区' }],
            initialValue: p?.areaData,
          })(
            <Cascader
              options={AreaJson}
              placeholder='请选择省市区，可输入进行搜索'
              showSearch={true}
              style={{ maxWidth: '50%' }}
              allowClear={false}
              onChange={this.handleAreaData}
            />,
          )}
        </Form.Item>
        {areaData || p?.areaData ? (
          <>
            <Form.Item label='场所地址详情：'>
              {getFieldDecorator('address', {
                rules: [{ required: true, message: '请输入场地地址详情' }],
                initialValue: p?.address,
              })(
                <AutoComplete
                  dataSource={t?.addressGroup}
                  placeholder='请输入详细地址，不含省市区'
                  onSearch={this.addressSearch}
                  onSelect={this.addressSelected}
                  onChange={this.addressChange}
                />,
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              {getFieldDecorator('coords', {
                rules: [{ required: true, message: '请选择定位' }],
                initialValue: p?.coords || [],
              })(
                <TxMap
                  handleAble={true}
                  address={address}
                  city={t?.addressObj?.areaData?.join('')}
                  style={{ width: '90%', height: '60vh' }}
                />,
              )}
            </Form.Item>
          </>
        ) : null}

        <Form.Item label='场所封面：'>
          {getFieldDecorator('coverUrl', {
            initialValue: p?.coverUrl,
          })(
            <ImageUploader
              limit={1}
              maxSize={1024 * 1024}
              btnText='选择图片'
              tips={
                <>
                  1、最多1张，建议为场地门面 <br />
                  2、建议图片的 长宽比保持25:33，单个图片大小不超过1M：bmp,png,jpg,jpeg <br />
                  3、未设置封面，系统默认将第一张介绍图片设为封面
                </>
              }
            />,
          )}
        </Form.Item>
        <Form.Item label='场所介绍图：'>
          {getFieldDecorator('introductionUrlList', {
            rules: [{ required: true, message: '请上传图片' }],
            initialValue: p?.introductionUrlList,
          })(
            <ImageUploader
              limit={4}
              btnText='选择图片'
              maxSize={1024 * 1024}
              tips={
                <>
                  1、最多4张，建议为场所内部图片 <br />
                  2、建议图片的 长宽比保持16:9，单个图片大小不超过1M：bmp,png,jpg,jpeg <br />
                </>
              }
            />,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button
            type='primary'
            htmlType='submit'
            loading={t.btnLoading}
            disabled={t.btnLoading}
            style={{ marginRight: '1em' }}
          >
            提交
          </Button>
          <Button type='info' onClick={this.handleReset}>
            取消
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({})(newLocation)
