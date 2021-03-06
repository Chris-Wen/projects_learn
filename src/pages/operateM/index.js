import React, { Component } from 'react'
import { Button, Table, Modal, Form, Input, Popconfirm, message } from 'antd'
import Image from '@/components/Image'
import ImageUploader from '@/components/ImageUploader'
import * as API from '@/apis/operate'
import { resJudge } from '@/utils/global'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { changeTokenAction } from '@/store/reducers'
import qs from 'qs'

import styles from '@/styles/global.module.css'
import classNames from 'classnames/bind'
let cx = classNames.bind(styles)

class OperationManage extends Component {
  state = {
    visible: false,
    btnLoading: false,
    isAddAction: false,
    loading: true,
    editData: { imageUrl: '', jumpUrl: '' },
    dataSource: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  }

  // table columns config
  columns = [
    {
      align: 'center',
      title: '运营位链接',
      dataIndex: 'jumpUrl',
      className: cx('td-max-width'),
      ellipsis: true,
    },
    {
      align: 'center',
      title: '运营位图片',
      dataIndex: 'imageUrl',
      render: (imageUrl) => <Image style={{ width: '130px', maxHeight: '80px' }} src={imageUrl} />,
    },
    {
      align: 'center',
      title: '被点击数',
      dataIndex: 'hitsCount',
    },
    {
      align: 'center',
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <span className={cx(status ? 'success-color' : 'info-color')}>{status ? '已上架' : '已下架'}</span>
      ),
    },
    {
      align: 'center',
      title: '操作',
      width: 250,
      key: 'operation',
      render: (item) => {
        return item.status ? (
          <PopoverButton
            onConfirm={() => this.handleRowData(item.id, 'state')}
            content='确认下架？'
            btnText='下架'
            styleClass={cx('btn', 'primary-color')}
          />
        ) : (
          <>
            <span className={cx('btn', 'primary-color')} onClick={() => this.handleRowData(item, 'edit')}>
              编辑
            </span>
            <PopoverButton
              onConfirm={() => this.handleRowData(item.id, 'state')}
              content='确认上架？'
              btnText='上架'
              styleClass={cx('btn', 'primary-color')}
            />
            <PopoverButton
              onConfirm={() => this.handleRowData(item.id, 'delete')}
              content='确认删除？'
              btnText='删除'
              styleClass={cx('btn', 'danger-color')}
            />
          </>
        )
      },
    },
  ]

  componentDidMount() {
    let { search } = this.props.location
    let { token } = qs.parse(search.slice(1))
    if (!this.props.token || this.props.token !== token) {
      token && this.props.changeTokenAction(token)
    }
    this.getData()
  }

  onPageChange = (current, pageSize) => this.getData({ current, pageSize })
  onSizeChange = (current, pageSize) => this.getData({ current: 1, pageSize })

  getData = async (params = {}) => {
    this.setState({ loading: true })
    let { current, pageSize } = { ...this.state.pagination, ...params }
    params = { current, size: pageSize }
    let dataSource = []
    let total = 0
    let r = await API.getBannerList(params)
    if (resJudge(r)) {
      dataSource = r.data.records
      total = r.data.total
    }

    this.setState({
      loading: false,
      dataSource,
      pagination: { current, pageSize, total },
    })
  }

  /**
   * @description 弹窗内容显示
   * @param {Boolean} isAdd
   * @param {Object} editData
   */
  handleModalStat = ({ imageUrl, jumpUrl, id }) => {
    this.setState(({ visible }) => ({
      visible: !visible,
      isAddAction: !id,
      editData: { imageUrl, jumpUrl, id },
    }))
  }

  /**
   * @description 对这行数据进行操作
   * @param {Obj} data
   * @param {String} type : 操作类型
   */
  handleRowData = async (data, type) => {
    if (type === 'edit') {
      this.handleModalStat(data)
    } else {
      let r = await (type === 'delete' ? API.deleteBData(data) : API.changeBStat(data))
      if (resJudge(r)) {
        message.success('操作成功')
        this.getData()
      }
    }
  }

  handleChildEvent = (ref) => (this.childRefForm = ref)

  onSubmit = () => {
    this.childRefForm.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ btnLoading: true })
        let params = {
          ...this.state.editData,
          ...values,
        }
        let r = await (params.id ? API.updateBData(params) : API.addBData(params))
        resJudge(r) && message.success(params.id ? '更新成功' : '新增成功')
        !params.id && this.childRefForm.resetFields()

        setTimeout(() => {
          this.getData()
          this.setState({
            btnLoading: false,
            visible: false,
            editData: { imageUrl: '', jumpUrl: '' },
          })
        }, 1000)
      }
    })
  }

  render() {
    let { state: t } = this

    return (
      <div className='page-tb'>
        <Button type='primary' icon='plus' onClick={this.handleModalStat} style={{ marginBottom: 16 }}>
          新建
        </Button>
        <Table
          pagination={{
            ...t.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共${total}条数据`,
            onShowSizeChange: this.onSizeChange,
            onChange: this.onPageChange,
          }}
          columns={this.columns}
          dataSource={t.dataSource}
          loading={t.loading}
          rowKey='id'
        ></Table>
        <Modal
          visible={t.visible}
          title={t.isAddAction ? '新建' : '编辑'}
          onCancel={this.handleModalStat}
          onOk={this.onSubmit}
          okText={t.isAddAction ? '新建' : '修改'}
          cancelText='取消'
          confirmLoading={t.btnLoading}
        >
          {t.visible && <ModalFormCreate {...t.editData} onChildEvent={this.handleChildEvent} />}
        </Modal>
      </div>
    )
  }
}

const PopoverButton = (props) => {
  return (
    <Popconfirm placement='left' onConfirm={props.onConfirm} okText='确定' cancelText='取消' title={props.content}>
      <span className={props.styleClass}>{props.btnText}</span>
    </Popconfirm>
  )
}

OperationManage.RouterName = '运营位管理'

const ModalFormCreate = Form.create({
  mapPropsToFields(props) {
    return {
      imageUrl: Form.createFormField({ value: props.imageUrl }),
      jumpUrl: Form.createFormField({ value: props.jumpUrl }),
    }
  },
})(
  class extends Component {
    componentDidMount() {
      typeof this.props.onChildEvent === 'function' && this.props.onChildEvent(this.props.form)
    }

    render() {
      const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 14 } }
      const { getFieldDecorator } = this.props.form
      const nameOptions = {
        validateTrigger: 'onChange',
        rules: [{ required: true, message: '请上传图片' }],
      }
      const linkOptions = {
        validateTrigger: 'onBlur',
        rules: [{ required: true, whitespace: true, message: '请输入链接' }],
      }
      return (
        <Form>
          <Form.Item label='上传图片' {...formItemLayout}>
            {getFieldDecorator('imageUrl', nameOptions)(<ImageUploader />)}
          </Form.Item>
          <Form.Item label='跳转链接' {...formItemLayout}>
            {getFieldDecorator('jumpUrl', linkOptions)(<Input placeholder='请输入' allowClear />)}
          </Form.Item>
        </Form>
      )
    }
  },
)

export default connect(({ global: { token } }) => ({ token }), { changeTokenAction })(withRouter(OperationManage))
