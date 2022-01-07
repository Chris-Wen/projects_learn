import React, { Component } from 'react'
import { Form, Input, InputNumber, Radio, DatePicker, Select, Button, TimePicker, Row, Col } from 'antd'
import moment from 'moment'
export default class NewClass extends Component {
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

  render() {
    let formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    return (
      <Form {...formLayout}>
        <Form.Item label='关联课程'>
          <Select
            showSearch
            style={{ maxWidth: 300 }}
            placeholder='请选择'
            optionFilterProp='children'
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Select.Option value='jack'>Jack</Select.Option>
            <Select.Option value='lucy'>Lucy</Select.Option>
            <Select.Option value='tom'>Tom</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='班级名称'>
          <Input placeholder='请输入班级名称,同一课程班级名称不能重复' style={{ maxWidth: 300 }} />
        </Form.Item>
        <Form.Item label='报名日期'>
          <DatePicker.RangePicker disabledDate={this.disabledDate} format='YYYY-MM-DD' />
        </Form.Item>
        <Form.Item label='开课日期'>
          <DatePicker />
        </Form.Item>
        <Form.Item label='预约方式'>线上预约，线下付费</Form.Item>
        <Form.Item label='班级人数上限'>
          <InputNumber placeholder='请输入' min={0} /> 人
        </Form.Item>
        <Form.Item label='老师微信'>
          <Input placeholder='请输入微信号，方便学生添加老师微信' style={{ maxWidth: 300 }} allowClear />
        </Form.Item>
        <Form.Item label='签到方式'>
          <Radio.Group defaultValue={1}>
            <Radio value={1}>扫码机签到</Radio>
            <Radio value={2}>手动签到</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='上课排期'>
          <ClassTimeGroup />
        </Form.Item>
        <Form.Item>
          <ButtonGroup comfirm={this.confirm} onCancel={this.props.onCancel} />
        </Form.Item>
      </Form>
    )
  }
}

function ButtonGroup(props) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Button type='primary' onClick={props.comfirm}>
        确定
      </Button>
      <Button onClick={props.onCancel} style={{ marginLeft: '20px' }}>
        取消
      </Button>
    </div>
  )
}

class ClassTimeGroup extends Component {
  state = {
    timeGroup: [
      {
        day: 1,
        start: null,
        end: null,
      },
    ],
    options: [
      { text: '周一', value: 1 },
      { text: '周二', value: 2 },
      { text: '周三', value: 3 },
      { text: '周四', value: 4 },
      { text: '周五', value: 5 },
      { text: '周六', value: 6 },
      { text: '周日', value: 0 },
    ],
  }

  addLine = () => {
    if (this.state.timeGroup.length >= 7) return

    this.setState(({ timeGroup }) => {
      timeGroup.push({
        day: 0,
        start: null,
        end: null,
      })
      return { timeGroup }
    })
  }

  handleChange = (i, type, ...arg) => {
    let timeGroup = this.state.timeGroup
    if (type === 'day') {
      timeGroup[i][type] = arg[0]
    } else {
      timeGroup[i][type] = arg[1]
    }
    this.setState({ timeGroup })
  }

  delLine = (i) => {
    this.setState(({ timeGroup }) => {
      timeGroup.splice(i, 1)
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
                value={item.day}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={(...arg) => this.handleChange(i, 'day', ...arg)}
                allowClear
              >
                {options.map((_obj) => (
                  <Select.Option value={_obj.value} key={_obj.value}>
                    {_obj.text}
                  </Select.Option>
                ))}
              </Select>
              <TimePicker
                value={item.start ? moment(item.start, 'HH:mm') : null}
                format='HH:mm'
                onChange={(...arg) => this.handleChange(i, 'start', ...arg)}
              />{' '}
              —{' '}
              <TimePicker
                value={item.end ? moment(item.end, 'HH:mm') : null}
                format='HH:mm'
                onChange={(...arg) => this.handleChange(i, 'end', ...arg)}
              />{' '}
              {timeGroup.length > 1 ? (
                <Button type='danger' shape='circle' icon='delete' onClick={() => this.delLine(i)} />
              ) : (
                ''
              )}
            </div>
          ))}
        </Col>
        <Col span={2}>
          {timeGroup.length < 7 ? <Button type='primary' shape='circle' icon='plus' onClick={this.addLine} /> : ''}
        </Col>
      </Row>
    )
  }
}
