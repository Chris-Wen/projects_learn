import React, { Component } from 'react'
import { Form, Button } from 'antd'
import ModalWrapComponent from '@/components/ModalWrapComponent'
import { getClassDetail } from '@/apis/classM'
import { resJudge, WEEKOPTIONS } from '@/utils/global'

export default class DetailTabComponent extends Component {
  state = {
    dataSource: {},
    needRefresh: false,
  }
  modalRef = React.createRef()

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    if (this.props.id) {
      let r = await getClassDetail(this.props.id)
      resJudge(r) && this.setState({ dataSource: r.data })
    }
  }

  trasformWeek = (val) => {
    for (const i in WEEKOPTIONS) {
      if (Object.hasOwnProperty.call(WEEKOPTIONS, i)) {
        const element = WEEKOPTIONS[i]
        if (element.value === val) return element.text
      }
    }
    return ''
  }

  handleEdit = (props = {}) => {
    let config = {
      path: `pages/classM/components/newClass.js`,
      title: '编辑班级',
      width: '80%',
      style: { top: 20 },
    }
    this.modalRef.current.initModal(config, {
      dataSource: { id: this.props.id, ...this.state.dataSource },
      refresh: () => {
        this.setState({ needRefresh: true })
        this.getData()
      },
    })
  }

  componentWillUnmount() {
    this.state.needRefresh && this.props?.refresh()
  }

  judgeStat = (val) => {
    switch (val) {
      case 'CAN_REGISTRATION':
      case 'REGISTRATION_FULL':
      case 'REGISTRATION_DEADLINE':
        return true
      default:
        return false
    }
  }

  render() {
    let formLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 21 },
    }
    let { dataSource: t } = this.state
    let { status } = this.props
    return (
      <>
        <Form {...formLayout}>
          <Form.Item label='关联课程'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{t?.courseName}</span>
              {this.judgeStat(status) ? (
                <Button type='primary' onClick={this.handleEdit}>
                  编辑班级
                </Button>
              ) : null}
            </div>
          </Form.Item>
          <Form.Item label='班级名称'>{t?.name}</Form.Item>
          <Form.Item label='报名日期'>
            {t?.registrationStartTime} ~ {t.registrationEndTime}
          </Form.Item>
          <Form.Item label='开课日期'>{t?.openClassTime}</Form.Item>
          <Form.Item label='班级教室'>{t?.classRoom?.name}</Form.Item>
          <Form.Item label='预约方式'>线上预约，线下付费</Form.Item>
          <Form.Item label='班级人数上限'>{t?.fullNumber} 人</Form.Item>
          <Form.Item label='老师微信'>{t?.wechat}</Form.Item>
          <Form.Item label='签到方式'>
            {t?.signType === 1 ? '扫码机签到' : t?.signType === 2 ? '手动签到' : ''}
          </Form.Item>
          <Form.Item label='上课排期'>
            {t?.classTimeList?.map((item, i) => (
              <div key={i}>
                每{this.trasformWeek(item?.week)} &nbsp;&nbsp;{item?.startTime} ~ {item?.endTime}
              </div>
            ))}
          </Form.Item>
        </Form>
        <ModalWrapComponent ref={this.modalRef} />
      </>
    )
  }
}
