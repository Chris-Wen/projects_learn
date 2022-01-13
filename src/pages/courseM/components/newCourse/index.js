import React, { Component } from 'react'
import { Button, Form, Input, Radio, InputNumber, message } from 'antd'
import ImageUploader from '@/components/ImageUploader'
import styles from './style.module.css'
import classNames from 'classnames/bind'
import { getSubject, getGrade, getCourseType } from '@/apis/global'
import { getCourseLabel, addCourse } from '@/apis/course'
import { resJudge } from '@/utils/global'
import { SubjectPopContent, PopoverSelection, GradePopContent, TagsSelection } from './component'
import { integerReg, priceReg } from '@/utils/reg'

let cx = classNames.bind(styles)

class CourseForm extends Component {
  state = {
    tags: [],
    gTags: [],
    cTags: [],
    customTag: '',
    courseOption: [],
    gradeOption: '请先选择科目',
    courseType: [],
  }

  validPrice = (rule, value, callback) => {
    if (value <= 0 || !priceReg.test(value)) {
      callback('请输入正确的产品价格:整数或者保留两位小数')
    } else if (value > 100000) {
      callback('价格不得大于100000')
    } else {
      callback()
    }
  }

  getGradeData = async (id) => {
    let r = await getGrade(id)
    resJudge(r) && this.setState({ gradeOption: r.data })
  }

  getLabelData = async () => {
    let { subjectId, ageId = [] } = this.props.form.getFieldsValue(['subjectId', 'ageId'])
    if (!subjectId || !ageId.length) {
      message.warning('请先选择年级-科目')
      return { checked: false, data: [] }
    } else {
      let result = await getCourseLabel(subjectId, ageId.toString()).catch((e) => console.log(e))
      if (resJudge(result)) return { checked: true, data: result.data }
      return { checked: false, data: [] }
    }
  }

  async componentDidMount() {
    let r = await Promise.all([getSubject(), getCourseType()]).catch((e) => console.log(e))
    if (resJudge(r[0]) && resJudge(r[1])) {
      this.setState({
        courseOption: r[0].data,
        courseType: r[1].data,
      })
    }
  }

  changeSubject = (val) => {
    val && this.getGradeData(val)
    for (let i in this.state.courseOption) {
      if (this.state.courseOption[i].id === val) {
        this.props.form.setFieldsValue({ courseLabelIdList: [], ageId: [] })
        this.setState({
          tags: [this.state.courseOption[i]],
          gTags: [],
          cTags: [],
          customTag: '',
        })
        return
      }
    }
  }

  changeGrade = (val) => {
    let gTags = []
    if (Array.isArray(val) && val.length) {
      this.state.gradeOption.forEach((item) => {
        val.includes(item.id) && gTags.push(item)
      })
    }
    this.props.form.setFieldsValue({ courseLabelIdList: [] })
    this.setState({ gTags, customTag: '', cTags: [] })
  }

  hanleCheckAll = (checked) => {
    let [gTags, ageId] = [[], []]
    if (checked) {
      this.state.gradeOption.forEach((item) => {
        ageId.push(item.id)
      })
      gTags = this.state.gradeOption
    }
    this.props.form.setFieldsValue({ ageId })
    this.setState({ gTags })
  }

  //移除科目、年龄标签
  handleClose = (val, type) => {
    if (type === 'tags') {
      //科目内容变更
      this.props.form.setFieldsValue({
        subjectId: undefined,
        ageId: [],
        courseLabelIdList: [],
      })
      this.setState({ tags: [], gradeOption: '请先选择科目', gTags: [], customTag: '', cTags: [] })
    } else if (type === 'gTags') {
      //年龄内容变更
      let [ageId, gTags] = [[], []]
      for (let i in this.state.gTags) {
        let item = this.state.gTags[i]
        if (item.id === val) continue
        gTags.push(item)
        ageId.push(item.id)
      }
      this.props.form.setFieldsValue({ ageId, courseLabelIdList: [] })
      this.setState({ gTags, customTag: '', cTags: [] })
    }
  }

  handleTagClose = (id, type) => {
    console.log(id, type)
    if (type === 'custom') {
      this.setState({ customTag: '' })
    } else {
      let { cTags } = this.state
      let courseLabelIdList = []
      for (let i in cTags) {
        if (cTags[i].id === id) {
          cTags.splice(i, 1)
        }

        cTags[i]?.id && courseLabelIdList.push(cTags[i].id)
      }
      this.props.form.setFieldsValue({ courseLabelIdList })
      this.setState({ cTags })
    }
  }

  handleTagChange = (val, obj) => this.setState(obj)

  handleSubmit = () => {
    this.props.form.validateFields(async (err, params) => {
      if (!err) {
        params.courseLogo = params.courseFirstPicture[0]
        params.priceWithScore = `${params.priceWithScore}`

        let r = await addCourse(params)
        if (resJudge(r)) {
          message.success('课程创建成功')
          this.props.hideModal()
          this.props.refresh && this.props.refresh()
        }
      } else {
        message.warning('请按规则完善表单内容')
      }
    })
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
            rules: [{ required: true, min: 3, max: 48, message: '请输入副标题，3~48个字符' }],
          })(<Input.TextArea className={cx('text-area')} rows={3} placeholder='请输入副标题，3~48个字符' allowClear />)}
        </Form.Item>
        <Form.Item label='所属科目'>
          {getFieldDecorator('subjectId', {
            rules: [{ required: true, message: '请选择科目' }],
          })(
            <PopoverSelection
              text='点击选择科目'
              options={courseOption}
              tags={t.tags}
              content={SubjectPopContent}
              onChange={this.changeSubject}
              onClose={(val) => this.handleClose(val, 'tags')}
            />,
          )}
        </Form.Item>
        <Form.Item label='适合年龄'>
          {getFieldDecorator('ageId', {
            rules: [{ required: true, message: '请选择年龄阶段' }],
            initialValue: [],
          })(
            <PopoverSelection
              text='点击选择年级'
              options={gradeOption}
              tags={t.gTags}
              content={GradePopContent}
              onChange={this.changeGrade}
              onClose={(val) => this.handleClose(val, 'gTags')}
              onCheckAll={this.hanleCheckAll}
            />,
          )}
        </Form.Item>
        <Form.Item label='课程标签'>
          {getFieldDecorator('courseLabelIdList', {
            rules: [{ required: true, message: '请选择课程标签' }],
            initialValue: [],
          })(
            <TagsSelection
              title='课程标签库'
              cTags={t.cTags}
              customTag={t.customTag}
              onClose={this.handleTagClose}
              getLabelData={this.getLabelData}
              onChange={this.handleTagChange}
            />,
          )}
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
          {getFieldDecorator('courseBriefIntroduction', {
            rules: [{ required: true, min: 1, max: 1000, message: '请填写课程简介,限1000字符' }],
          })(
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
          {getFieldDecorator('courseType', {
            rules: [{ required: true, message: '请选择课程类型' }],
          })(
            <Radio.Group>
              {t.courseType.map((item) => (
                <Radio key={item.id} value={item.id}>
                  {item.name}
                </Radio>
              ))}
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item label='课时数'>
          {getFieldDecorator('courseNodes', {
            rules: [
              { required: true, message: '请输入课时数' },
              { pattern: integerReg, message: '请输入正整数' },
            ],
          })(<InputNumber min={1} className={cx('input')} placeholder='请输入课时数' />)}
          节
        </Form.Item>
        <Form.Item label='不使用积分价格'>
          {getFieldDecorator('priceWithoutScore', {
            rules: [{ required: true, message: '请输入价格，且大于等于0' }, { validator: this.validPrice }],
          })(<Input className={cx('input-number')} placeholder='请输入' allowClear addonAfter='元' />)}
        </Form.Item>
        <Form.Item label='使用积分现金价格'>
          {getFieldDecorator('priceWithCash', {
            rules: [{ required: true, message: '请输入价格，且大于等于0' }, { validator: this.validPrice }],
          })(<Input className={cx('input-number')} placeholder='请输入' allowClear addonAfter='元' />)}
        </Form.Item>
        <Form.Item label='使用积分数'>
          {getFieldDecorator('priceWithScore', {
            rules: [
              { required: true, message: '请输入积分数,最大100000' },
              { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
            ],
          })(<InputNumber min={1} max={100000} className={cx('input')} placeholder='请输入' />)}
          积分
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
          <Button type='primary' onClick={this.handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const NewCourse = Form.create({ name: 'newCourse' })(CourseForm)

export default NewCourse
