import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Icon, Input, Popover, Radio, Row, Col, Tag, InputNumber } from 'antd'
import ImageUploader from '@/components/ImageUploader'
import styles from './style.module.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)

class NewCourseForm extends Component {
  state = {
    tags: ['早教', '语言'],
    courseOption: [
      { text: '早教', value: 0 },
      { text: '语言', value: 1 },
      { text: '自然科学', value: 2 },
      { text: '学科', value: 3 },
    ],
    gradeOption: '请先选择科目',
  }

  componentDidMount() {}

  handleSubmit = (submitType) => {
    if (submitType) {
    } else {
    }
  }

  render() {
    let formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    }
    let { courseOption, gradeOption } = this.state
    let { state: t } = this
    const { getFieldDecorator } = this.props.form

    return (
      <Form {...formLayout}>
        <div className={cx('sub-title')}>基础信息</div>
        <Form.Item label='课程名称'>
          {getFieldDecorator('courseName', {
            rules: [{ required: true, min: 3, max: 16, message: '请输入课程名称，3~16个字符' }],
          })(<Input className={cx('input')} placeholder='请输入课程名称，3~16个字符' allowClear />)}
        </Form.Item>
        <Form.Item label='优势亮点'>
          {getFieldDecorator('courseSubtitle', {
            rules: [{ required: true, min: 3, max: 48, message: '请输入课程名称，3~16个字符' }],
          })(<Input.TextArea className={cx('text-area')} rows={3} placeholder='请输入副标题，3~48个字符' allowClear />)}
        </Form.Item>
        <Form.Item label='所属科目'>
          {getFieldDecorator('subjectId', {
            rules: [{ required: true, message: '请选择科目' }],
          })(<CourseOption text='点击选择科目' options={courseOption} tags={t.tags} />)}
        </Form.Item>
        <Form.Item label='适合年龄'>
          <CourseOption text='点击选择科目' options={gradeOption} />
        </Form.Item>
        <Form.Item label='课程标签'>
          <CourseOption text='点击选择科目' options={courseOption} />
        </Form.Item>
        <Form.Item label='课程头图'>
          {getFieldDecorator('courseFirstPicture', {
            rules: [{ required: true, message: '请上传课程头图' }],
          })(
            <ImageUploader
              limit={4}
              btnText='选择图片'
              tips={
                <>
                  1、最多4张，建议课程海报（1V1名师，小升初安心无忧）等 <br />
                  2、单个图片大小不超过10M：bmp,png,jpg,jpeg <br />
                  3、未设置封面，系统默认将第一张图片设为封面
                </>
              }
            />,
          )}
        </Form.Item>
        <Form.Item label='课程介绍图'>
          {getFieldDecorator('coursePicture', {
            rules: [{ required: true, message: '请上传课程介绍图' }],
          })(
            <ImageUploader
              limit={10}
              btnText='选择图片'
              tips={
                <>
                  1、最多10张，建议课程介绍图，培养目标，课程特色，课程介绍等 <br />
                  2、单个图片大小不超过10M：bmp,png,jpg,jpeg <br />
                </>
              }
            />,
          )}
        </Form.Item>
        <Form.Item label='课程简介'>
          {getFieldDecorator('courseBriefIntroduction')(
            <Input.TextArea
              className={cx('text-area')}
              rows={3}
              placeholder='课时：1课时
              班型：1V1'
              allowClear
            />,
          )}
        </Form.Item>
        <div className={cx('sub-title')}>售卖信息</div>
        <Form.Item label='课程类型'>
          {getFieldDecorator('courseSubtitle', {
            rules: [{ required: true, message: '请选择课程类型' }],
            initialValue: 1,
          })(
            <Radio.Group>
              <Radio value={1}>惠普幼托</Radio>
              <Radio value={2}>邻里学堂</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item label='课时数'>
          {getFieldDecorator('courseNodes', {
            rules: [{ required: true, min: 1, message: '请输入课时数' }],
          })(<InputNumber min={1} className={cx('input')} placeholder='请输入课时数' />)}
          节
        </Form.Item>
        <Form.Item label='不使用积分价格'>
          {getFieldDecorator('priceWithoutScore', {
            rules: [{ required: true, min: 0.01, message: '请输入价格，且大于等于0' }],
          })(<Input className={cx('input-number')} placeholder='请输入' allowClear addonAfter='元' />)}
        </Form.Item>
        <Form.Item label='使用积分现金价格'>
          {getFieldDecorator('priceWithCash', {
            rules: [{ required: true, min: 0.01, message: '请输入价格，且大于等于0' }],
          })(<Input className={cx('input-number')} placeholder='请输入' allowClear addonAfter='元' />)}
        </Form.Item>
        <Form.Item label='使用积分数'>
          {getFieldDecorator('priceWithScore', {
            rules: [{ required: true, min: 1, max: 100000, message: '请输入积分数，1' }],
          })(<InputNumber min={1} className={cx('input')} placeholder='请输入' />)}
          积分
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
          <Button style={{ marginRight: '1em' }} onClick={() => this.handleSubmit('save')}>
            保存
          </Button>
          <Button type='primary' onClick={this.handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

/**
 * @description 气泡弹窗内容
 * @param {object} props
 * @returns Component
 */
let PopContent = (props) => (
  <Radio.Group onChange={props.onChange} value={props.value}>
    <Row>
      {props.options?.map((item, i) => (
        <Col span={8} className={cx('col')} key={i}>
          <Radio value={item.value}>{item.text}</Radio>
        </Col>
      ))}
    </Row>
  </Radio.Group>
)

/**
 * @description 科目、年龄选择组件
 * @param {object} props
 * @returns Component
 */
let CourseOption = (props) => {
  let { tags = [], text = '', type = 'right', ..._props } = props

  return (
    <>
      {tags?.map((tag, i) => (
        <Tag closable={true} onClose={() => props.onClose(tag)} key={i} color='blue'>
          {tag}
        </Tag>
      ))}
      <Popover
        content={Array.isArray(_props.options) ? <PopContent {..._props} /> : _props.options || ''}
        trigger='click'
        placement='right'
      >
        <span className={cx('info-button')}>
          {text} <Icon type={type} />
        </span>
      </Popover>
    </>
  )
}

CourseOption.propTypes = {
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

CourseOption.defaultProps = {
  onClose: () => {},
  onChange: () => {},
}

const NewCourse = Form.create({ name: 'newCourse' })(NewCourseForm)

export default NewCourse
