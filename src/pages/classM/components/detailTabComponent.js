import React, { Component } from 'react'
import { Form } from 'antd'

export default class DetailTabComponent extends Component {
  render() {
    let formLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
    }

    return (
      <Form {...formLayout}>
        <Form.Item label='关联课程'></Form.Item>
        <Form.Item label='班级名称'></Form.Item>
        <Form.Item label='报名日期'></Form.Item>
        <Form.Item label='开课日期'></Form.Item>
        <Form.Item label='预约方式'>线上预约，线下付费</Form.Item>
        <Form.Item label='班级人数上限'></Form.Item>
        <Form.Item label='老师微信'></Form.Item>
        <Form.Item label='签到方式'></Form.Item>
        <Form.Item label='上课排期'></Form.Item>
      </Form>
    )
  }
}
