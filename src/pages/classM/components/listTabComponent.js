import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Form, Button, Input, message, Popconfirm, InputNumber } from 'antd'
import ImageUploader from '@/components/ImageUploader'
import Image from '@/components/Image'
import { getStudentList, payment, refund, deleteStudent, cancelPayment } from '@/apis/classM'
import { resJudge } from '@/utils/global'
import { priceReg } from '@/utils/reg'

import styles from '@/styles/global.module.css'
import classNames from 'classnames/bind'
let cx = classNames.bind(styles)

export default class ListTabComponent extends Component {
  state = {
    dataSource: [],
    loading: false,
    needReturnRefresh: false,
  }
  modalRef = React.createRef()
  columns = [
    {
      align: 'center',
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      align: 'center',
      title: '学员信息',
      dataIndex: 'studentName',
      render: (text, record) => (
        <>
          <div style={{ color: '#000' }}>{text || ''}</div>
          <div>联系方式：{record.studentMobile || ''}</div>
        </>
      ),
    },
    {
      align: 'center',
      title: '预约人',
      className: cx('td-max-width'),
      ellipsis: true,
      dataIndex: 'nickname',
    },
    {
      align: 'center',
      title: '缴费状态',
      key: 'payStatus',
      render: (item) => <StatusText {...item} />,
    },
    {
      align: 'center',
      title: '操作',
      dataIndex: 'paymentStatus',
      render: (stat, item) => (
        <>
          {!stat ? (
            <>
              <span className={cx('btn', 'primary-color')} onClick={() => this.handleStat(item, 'pay')}>
                缴费
              </span>{' '}
              |
              <Popconfirm
                placement='left'
                title={
                  <span>
                    删除学员后，该学员将被默认
                    <span style={{ color: 'red' }}>取消预约</span>
                    <br />
                    本课程，该操作无法撤回，是否继续？
                  </span>
                }
                onConfirm={() => this.handleStat(item.registrationId, 'delete')}
                okText='继续'
                cancelText='取消'
              >
                <span className={cx('btn', 'danger-color')}>删除</span>
              </Popconfirm>
            </>
          ) : item.canCancelStatus ? (
            <Popconfirm
              placement='left'
              title={
                <span>
                  取消缴费后，该学员将回到未缴费状态，
                  <br />
                  ，请核对仔细后继续！
                </span>
              }
              onConfirm={() => this.handleStat(item.registrationId, 'cancel')}
              okText='继续'
              cancelText='取消'
            >
              <span className={cx('btn', 'danger-color')}>取消缴费</span>
            </Popconfirm>
          ) : !item.refundStatus ? (
            <span className={cx('btn', 'danger-color')} onClick={() => this.handleStat(item, 'refund')}>
              退款
            </span>
          ) : (
            <span className={cx('btn', 'primary-color')} onClick={() => this.handleStat(item, 'info')}>
              查看退款详情
            </span>
          )}
        </>
      ),
    },
  ]

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    if (this.props.id) {
      this.setState({ loading: true })
      let r = await getStudentList(this.props.id)
      resJudge(r) && this.setState({ dataSource: r.data, loading: false })
    }
  }

  //list数据修改相关方法
  handleStat = async (data, type) => {
    if (type === 'info') {
      Modal.info({
        title: '退款详情',
        content: (
          <>
            <p>学员姓名：{data?.studentName}</p>
            <p>缴费金额: {data?.paymentPrice}元</p>
            <p>退款金额: {data?.refundPrice}元</p>
            <p>
              退款凭证: <Image src={data?.refundVoucher} style={{ width: 100, maxHeight: 150 }} />{' '}
            </p>
          </>
        ),
      })
    } else if (type === 'delete' || type === 'cancel') {
      let r = await (type === 'delete' ? deleteStudent(data) : cancelPayment(data))
      if (resJudge(r)) {
        message.success('操作成功')
        this.setState({ needReturnRefresh: true })
        this.getData()
      }
    } else {
      this.modalRef.current.init(type, data)
    }
  }

  render() {
    let { state: t } = this
    return (
      <>
        <Table
          pagination={false}
          columns={this.columns}
          rowKey='registrationId'
          dataSource={t.dataSource}
          loading={t.loading}
          scroll={{ y: '100vh' }}
        ></Table>
        <WrapDialog ref={this.modalRef} callback={this.getData} />
      </>
    )
  }
}

let StatusText = (props) => {
  if (props?.paymentStatus) {
    if (props?.refundStatus) {
      return (
        <>
          已退款<br></br>退款金额： {props?.refundPrice}
        </>
      )
    } else {
      return (
        <>
          已缴费<br></br> 收据单号：{props?.paymentReceiptNo}
        </>
      )
    }
  } else {
    return <span className={cx('primary-color')}>未缴费</span>
  }
}

//弹窗
class WrapDialog extends Component {
  state = {
    visible: false,
    data: {},
    type: null,
    title: '',
  }

  init = (type, data = {}) =>
    this.setState({ visible: true, data, type, title: type === 'pay' ? '学员缴费' : '退款窗口' })

  onCancel = () => this.setState({ visible: false })
  handleSubmit = async (val = {}) => {
    let params = {
      registrationId: this.state.data.registrationId,
      ...val,
    }
    let r = await (this.state.type === 'pay' ? payment(params) : refund(params))
    if (resJudge(r)) {
      message.success('操作成功')
      setTimeout(() => {
        this.onCancel()
        this.props?.callback()
      }, 1000)
    }
  }

  render() {
    let { visible, title, data, type } = this.state

    return (
      <Modal visible={visible} title={title} footer={null} onCancel={this.onCancel}>
        <FormContent handleSubmit={this.handleSubmit} onCancel={this.onCancel} data={data} type={type} />
      </Modal>
    )
  }
}

let FormContent = Form.create({})((props) => {
  const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 14 } }
  let {
    data,
    type,
    form: { getFieldDecorator },
  } = props

  let handleSubmit = () => {
    props.form.validateFields((err, values) => !err && props?.handleSubmit(values))
  }

  return (
    <Form {...formItemLayout}>
      <Form.Item label='学员姓名'>{data?.studentName}</Form.Item>
      <Form.Item label='缴费金额'>{data?.paymentPrice}元</Form.Item>
      {!type ? null : type === 'pay' ? (
        <Form.Item label='请输入收据号'>
          {getFieldDecorator('paymentReceiptNo', {
            rules: [{ required: true, message: '请输入收据号' }],
          })(<Input placeholder='请输入收据号' allowClear />)}
        </Form.Item>
      ) : (
        <>
          <Form.Item label='退款金额'>
            {getFieldDecorator('refundPrice', {
              rules: [
                { required: true, message: '请输入退款金额' },
                { pattern: priceReg, message: '请输入正确金额' },
              ],
            })(<InputNumber placeholder='请输入退款金额' min={0} allowClear />)}
          </Form.Item>
          <Form.Item label='退款凭证'>
            {getFieldDecorator('refundVoucher', {
              rules: [{ required: true, message: '请上传退款凭证图片' }],
            })(<ImageUploader tips='请上传退款截图，仅限1张，要求图片格式为jpg、png的格式' accept='.png,.jpeg,.jpg' />)}
          </Form.Item>
        </>
      )}
      <Form.Item>
        <div style={{ float: 'right' }}>
          <div>
            <Button type='info' onClick={props.onCancel}>
              取消
            </Button>
            &nbsp;&nbsp;
            <Button type='primary' onClick={handleSubmit}>
              确定
            </Button>
          </div>
        </div>
      </Form.Item>
    </Form>
  )
})

FormContent.propTypes = {
  onCancel: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  type: PropTypes.string,
}
