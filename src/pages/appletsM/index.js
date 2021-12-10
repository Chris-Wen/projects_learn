import React, { Component } from 'react'
import { Button, Table, Modal, Form, Input } from 'antd'

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
  }

  // table columns config
  columns = [
    {
      align: 'center',
      title: '社区ID',
      dataIndex: 'id',
    },
    {
      align: 'center',
      title: '社区名称',
      dataIndex: 'name',
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
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (item) => <a onClick={() => this.handleModalStat(false, item)}>编辑</a>,
    },
  ]

  componentDidMount() {
    this.getData()
  }

  getData() {
    this.setState({ loading: true })
    let dataSource = []
    setTimeout(() => {
      for (let i = 0; i < 32; i++) {
        dataSource.push({
          key: i,
          id: 123,
          name: `未来社区${Math.random().toFixed(3)}`,
          appid: 'xxadkd1cxxxx',
        })
      }
      this.setState({ loading: false, dataSource })
    }, 1000)
  }

  /**
   * @description 弹窗内容显示
   * @param {Boolean} isAdd
   * @param {Object} editData
   */
  handleModalStat = (isAdd, editData = { name: '', appid: '' }) => {
    this.setState(({ visible }) => {
      var params = {
        visible: !visible,
        editData,
      }
      if (!visible) params.isAddAction = isAdd === true
      return params
    })
  }

  handleChildEvent = (ref) => (this.childRefForm = ref)

  onSubmit = () => {
    this.childRefForm.validateFields((err, values) => {
      if (!err) {
        this.setState({ btnLoading: true })
        // let params = {
        //   ...this.state.editData,
        //   ...values,
        // }

        setTimeout(() => {
          this.setState({
            btnLoading: false,
            visible: false,
            editData: { name: '', appid: '' },
          })
        }, 3000)
      }
    })
  }

  render() {
    let { state: t } = this

    return (
      <div className='page-tb'>
        <Button type='primary' icon='plus' onClick={() => this.handleModalStat(true)} style={{ marginBottom: 16 }}>
          新建
        </Button>
        <Table columns={this.columns} dataSource={t.dataSource} loading={t.loading}></Table>
        <Modal
          visible={t.visible}
          title={t.isAddAction ? '新建' : '编辑'}
          onCancel={this.handleModalStat}
          onOk={this.onSubmit}
          okText={t.isAddAction ? '新建' : '修改'}
          cancelText='取消'
          confirmLoading={t.btnLoading}
        >
          <ModalFormCreate {...t.editData} onChildEvent={this.handleChildEvent} />
        </Modal>
      </div>
    )
  }
}

AppletsManage.RouterName = '小程序管理'

const ModalFormCreate = Form.create({
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({ value: props.name }),
      appid: Form.createFormField({ value: props.appid }),
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
        validateTrigger: 'onBlur',
        rules: [
          { required: true, whitespace: true, message: '请输入社区名称' },
          { max: 15, message: '不超过15字' },
        ],
      }
      const appidOptions = {
        validateTrigger: 'onBlur',
        rules: [{ required: true, whitespace: true, message: '请输入小程序appid' }],
      }
      return (
        <Form>
          <Form.Item label='社区名称' {...formItemLayout}>
            {getFieldDecorator('name', nameOptions)(<Input placeholder='请输入社区名称' allowClear />)}
          </Form.Item>
          <Form.Item label='社区平台小程序appid' {...formItemLayout}>
            {getFieldDecorator('appid', appidOptions)(<Input placeholder='请输入小程序appid' allowClear />)}
          </Form.Item>
        </Form>
      )
    }
  },
)
