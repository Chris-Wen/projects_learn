import React, { Component } from 'react'
import { Button, Table, Modal, Form, Input, message } from 'antd'
import { getAppletsList, updateAppletsData } from '@/apis/applets'
import { resJudge } from '@/utils/global'

/**
 * 小程序管理页面
 * @returns Component
 */
export default class AppletsManage extends Component {
  state = {
    visible: false,
    btnLoading: false,
    isAddAction: false,
    loading: true,
    editData: { name: '', appid: '' },
    dataSource: [],
    pagination: { current: 1, size: 10, total: 0 },
  }

  // table columns config
  columns = [
    {
      align: 'center',
      title: '社区ID',
      dataIndex: 'platformCommunityId',
    },
    {
      align: 'center',
      title: '社区名称',
      dataIndex: 'communityName',
    },
    {
      align: 'center',
      title: '平台小程序appID',
      dataIndex: 'appid',
    },
    {
      align: 'center',
      title: '操作',
      width: 200,
      key: 'operation',
      fixed: 'right',
      render: (item) => (
        <Button type='link' onClick={() => this.handleModalStat(item)}>
          编辑
        </Button>
      ),
    },
  ]

  componentDidMount() {
    this.getData()
  }

  onPageChange = (current, size) => {
    this.getData({ current, size })
  }
  onSizeChange = (current, size) => {
    this.getData({
      current: 1,
      size,
    })
  }

  getData = async (params = {}) => {
    this.setState({ loading: true })
    let { current, size } = { ...this.state.pagination, ...params }
    params = { current, size }
    let dataSource = []
    let total = 0
    let r = await getAppletsList()
    if (resJudge(r)) {
      dataSource = r.data.records
      total = r.data.total
    }
    this.setState({ loading: false, dataSource, pagination: { current, size, total } })
  }

  /**
   * @description 弹窗内容显示
   * @param {Boolean} isAdd
   * @param {Object} editData
   */
  handleModalStat = (editData) => {
    this.setState(({ visible }) => ({
      visible: !visible,
      editData,
    }))
  }

  onSubmit = () => {
    this.childRefForm.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ btnLoading: true })
        let params = {
          ...this.state.editData,
          ...values,
        }
        let r = await updateAppletsData(params)
        resJudge(r) && message.success('更新成功')

        setTimeout(() => {
          this.getData()
          this.setState({
            btnLoading: false,
            visible: false,
            editData: {},
          })
        }, 1000)
      }
    })
  }

  render() {
    let { state: t } = this

    return (
      <div className='page-tb'>
        <Table
          pagination={{
            ...t.pagination,
            showSizeChanger: true,
            showTotal: (total) => `共${total}条数据`,
            onShowSizeChange: this.onSizeChange,
            onChange: this.onPageChange,
          }}
          rowKey='platformCommunityId'
          columns={this.columns}
          dataSource={t.dataSource}
          loading={t.loading}
        />
        <Modal
          visible={t.visible}
          title='编辑'
          onCancel={this.handleModalStat}
          onOk={this.onSubmit}
          okText='修改'
          cancelText='取消'
          confirmLoading={t.btnLoading}
        >
          <ModalFormCreate {...t.editData} bindRef={(ref) => (this.childRefForm = ref)} />
        </Modal>
      </div>
    )
  }
}

AppletsManage.RouterName = '小程序管理'

const ModalFormCreate = Form.create({
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({ value: props.communityName }),
      appid: Form.createFormField({ value: props.appid }),
    }
  },
})(
  class extends Component {
    componentDidMount() {
      typeof this.props.bindRef === 'function' && this.props.bindRef(this.props.form)
    }

    render() {
      const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 14 } }
      const { getFieldDecorator } = this.props.form

      const appidOptions = {
        validateTrigger: 'onBlur',
        rules: [{ required: true, whitespace: true, message: '请输入小程序appid' }],
      }
      return (
        <Form>
          <Form.Item label='社区名称' {...formItemLayout}>
            {getFieldDecorator('name')(<Input placeholder='请输入社区名称' allowClear disabled />)}
          </Form.Item>
          <Form.Item label='社区平台小程序appid' {...formItemLayout}>
            {getFieldDecorator('appid', appidOptions)(<Input placeholder='请输入小程序appid' allowClear />)}
          </Form.Item>
        </Form>
      )
    }
  },
)
