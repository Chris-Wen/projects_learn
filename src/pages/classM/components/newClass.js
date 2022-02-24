import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, DatePicker, Select, Button, TimePicker, Row, Col, message } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { zywReg20, integerReg } from '@/utils/reg'
import { resJudge, WEEKOPTIONS } from '@/utils/global'
import { getCourseList, getClassRoomList, updateClass, addClass } from '@/apis/classM'

moment.locale('zh-cn')
class NewClass extends Component {
  state = {
    classRoomOptions: [],
    courseOptions: [],
  }

  range(start, end) {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }

  disabledDate = (current) => {
    return current && current < moment().startOf('day')
  }

  disabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      }
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56],
    }
  }

  classTimeValidator = (_, obj, callback) => {
    if (obj?.some((item) => !item.week || !item.startTime || !item.endTime || item.startTime >= item.endTime)) {
      callback('请完善时间排期内容, 且结束时间必须大于开始时间')
    } else if (obj && obj.length > 1) {
      let weekArr = new Set()
      obj?.forEach((item) => item.week && weekArr.add(item.week))
      weekArr.size !== obj.length ? callback('请检查时间排期，每天只能安排一节课') : callback()
      weekArr = null
    } else callback()
  }
  signTimeValidator = (_, values, callback) => {
    if (values && values.length === 2) {
      let endTime = values[1]
      let startTime = this.props.form.getFieldValue('openClassTime')
      if (endTime && startTime) {
        try {
          endTime.format('YYYY-MM-DD') >= startTime.format('YYYY-MM-DD')
            ? callback('报名截止日期必须小于开课日期')
            : callback()
        } catch (error) {
          callback()
        }
      } else callback()
    } else callback()
  }
  classStartValidator = (_, values, callback) => {
    if (values) {
      let rangeTime = this.props.form.getFieldValue('rangeTime')
      if (rangeTime && rangeTime[1] && rangeTime.length === 2) {
        try {
          rangeTime[1].format('YYYY-MM-DD') >= values.format('YYYY-MM-DD')
            ? callback('开课日期必须大于报名截止日期')
            : callback()
        } catch (error) {
          callback()
        }
      } else callback()
    } else callback()
  }

  componentDidMount() {
    Promise.all([getCourseList(), getClassRoomList()]).then((r) => {
      if (resJudge(r[0]) && resJudge(r[1])) {
        this.setState({
          courseOptions: r[0].data,
          classRoomOptions: r[1]?.data.records,
        })
      }
    })
  }

  handleSubmit = (e) => {
    e?.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { openClassTime, classRoom } = values
        let { rangeTime, ...params } = values
        params.registrationStartTime = rangeTime[0].format('YYYY-MM-DD')
        params.registrationEndTime = rangeTime[1].format('YYYY-MM-DD')
        params.openClassTime = openClassTime.format('YYYY-MM-DD')
        params.classRoom = JSON.parse(classRoom)
        let isAdd = !!this.props?.dataSource?.id
        isAdd && (params.id = this.props?.dataSource?.id)

        let r = await (this.props?.dataSource?.id ? updateClass(params) : addClass(params))
        if (resJudge(r)) {
          !isAdd && this.props.form.resetFields()
          message.success('操作成功')

          setTimeout(() => {
            this.props?.hideModal()
            this.props?.refresh()
          }, 1000)
        }
      }
    })
  }

  render() {
    let { getFieldDecorator } = this.props.form
    let { courseOptions, classRoomOptions } = this.state
    let formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    let { dataSource: p } = this.props
    let rangeTime =
      p && p?.registrationStartTime && p?.registrationEndTime
        ? [moment(p?.registrationStartTime, 'YYYY-MM-DD'), moment(p?.registrationEndTime, 'YYYY-MM-DD')]
        : null

    return (
      <Form {...formLayout} onSubmit={this.handleSubmit}>
        <Form.Item label='关联课程'>
          {getFieldDecorator('courseId', {
            rules: [{ required: true, message: '请选择课程' }],
            initialValue: p?.courseId,
          })(
            <Select
              showSearch
              style={{ maxWidth: 300 }}
              placeholder='请选择'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {courseOptions?.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.courseName}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label='班级名称'>
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入班级名称,同一课程班级名称不能重复' },
              { pattern: zywReg20, message: '支持中英文数字，限20字符' },
            ],
            initialValue: p?.name,
          })(<Input placeholder='请输入班级名称,同一课程班级名称不能重复' style={{ maxWidth: 300 }} allowClear />)}
        </Form.Item>
        <Form.Item label='报名日期'>
          {getFieldDecorator('rangeTime', {
            rules: [{ required: true, message: '请选择报名日期' }, { validator: this.signTimeValidator }],
            initialValue: rangeTime,
          })(<DatePicker.RangePicker disabledDate={this.disabledDate} format='YYYY-MM-DD' />)}
        </Form.Item>
        <Form.Item label='开课日期'>
          {getFieldDecorator('openClassTime', {
            rules: [{ required: true, message: '请选择开课日期' }, { validator: this.classStartValidator }],
            initialValue: p?.openClassTime ? moment(p.openClassTime, 'YYYY-MM-DD') : null,
          })(<DatePicker format='YYYY-MM-DD' />)}
        </Form.Item>
        <Form.Item label='班级教室'>
          {getFieldDecorator('classRoom', {
            rules: [{ required: true, message: '请选择教室' }],
            initialValue: JSON.stringify(p?.classRoom),
          })(
            <Select
              showSearch
              style={{ maxWidth: 300 }}
              placeholder='请选择教室'
              optionFilterProp='children'
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {classRoomOptions?.map((item) => (
                <Select.Option value={JSON.stringify(item)} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label='预约方式'>线上预约，线下付费</Form.Item>
        <Form.Item label='班级人数上限'>
          {getFieldDecorator('fullNumber', {
            rules: [
              { required: true, type: 'number', message: '请输入班级人数上限' },
              { pattern: integerReg, message: '请输入正整数' },
            ],
            initialValue: p?.fullNumber,
          })(<InputNumber placeholder='请输入' min={1} max={50} />)}
          人
        </Form.Item>
        <Form.Item label='老师微信'>
          {getFieldDecorator('wechat', {
            rules: [{ required: true, message: '请填写老师微信' }],
            initialValue: p?.wechat,
          })(<Input placeholder='请输入微信号，方便学生添加老师微信' style={{ maxWidth: 300 }} allowClear />)}
        </Form.Item>
        <Form.Item label='签到方式'>
          {getFieldDecorator('signType', {
            rules: [{ required: true, message: '请选择签到方式' }],
            initialValue: p?.signType || 1,
          })(
            <Radio.Group>
              <Radio value={1}>扫码机签到</Radio>
              <Radio value={2}>手动签到</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item label='上课排期'>
          {getFieldDecorator('classTimeList', {
            rules: [
              { required: true, type: 'array', min: 1, message: '请填写上课排期' },
              { validator: this.classTimeValidator },
            ],
            initialValue: p?.classTimeList,
          })(<ClassTimeGroup />)}
        </Form.Item>
        <Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button type='primary' htmlType='submit'>
              确定
            </Button>
            <Button onClick={this.props.hideModal} style={{ marginLeft: '20px' }}>
              取消
            </Button>
          </div>
        </Form.Item>
      </Form>
    )
  }
}

class ClassTimeGroup extends Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props)
    let timeGroup = props.value || [{ week: null, startTime: null, endTime: null }]
    this.state = {
      timeGroup,
      options: WEEKOPTIONS,
    }
  }

  addLine = () => {
    if (this.state.timeGroup.length >= 7) return

    this.setState(({ timeGroup }) => {
      timeGroup.push({
        week: null,
        startTime: null,
        endTime: null,
      })
      this.props.onChange && this.props.onChange(timeGroup)
      return { timeGroup }
    })
  }

  handleChange = (i, type, ...arg) => {
    let timeGroup = this.state.timeGroup
    timeGroup[i][type] = type === 'week' ? arg[0] : arg[1]

    this.props.onChange && this.props.onChange(timeGroup)

    this.setState({ timeGroup })
  }

  delLine = (i) => {
    this.setState(({ timeGroup }) => {
      timeGroup.splice(i, 1)
      this.props.onChange && this.props.onChange(timeGroup)
      return { timeGroup }
    })
  }

  render() {
    let { timeGroup, options } = this.state

    return (
      <Row>
        <Col span={20}>
          {timeGroup.map((item, i) => (
            <div key={i}>
              <Select
                showSearch
                placeholder='请选择'
                style={{ width: 100, marginRight: 20 }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={(...arg) => this.handleChange(i, 'week', ...arg)}
                defaultValue={item.week}
                allowClear
              >
                {options.map((obj) => (
                  <Select.Option value={obj.value} key={obj.value}>
                    {obj.text}
                  </Select.Option>
                ))}
              </Select>
              <TimePicker
                value={item.startTime ? moment(item.startTime, 'HH:mm') : null}
                format='HH:mm:ss'
                onChange={(...arg) => this.handleChange(i, 'startTime', ...arg)}
              />{' '}
              —{' '}
              <TimePicker
                value={item.endTime ? moment(item.endTime, 'HH:mm') : null}
                format='HH:mm:ss'
                onChange={(...arg) => this.handleChange(i, 'endTime', ...arg)}
              />{' '}
              {timeGroup.length > 1 ? (
                <Button type='danger' shape='circle' icon='delete' size='small' onClick={() => this.delLine(i)} />
              ) : (
                ''
              )}
            </div>
          ))}
        </Col>
        <Col span={2}>
          {timeGroup.length < 7 ? (
            <Button type='primary' shape='circle' size='small' icon='plus' onClick={this.addLine} />
          ) : null}
        </Col>
      </Row>
    )
  }
}

export default Form.create({})(NewClass)
