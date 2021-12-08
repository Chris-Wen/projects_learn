import React, { Component } from 'react'
import { Button, Table, Modal, Form, Input } from 'antd'
import PropTypes from 'prop-types'

/**
 * 小程序管理页面
 * @returns Component
 */
export default class MpMange extends Component {
  state = {
    visible: true,
    btnLoading: false,
    isAddAction: false,
    editData: {
      name: '',
      appid: '',
    },
    dataSource: [
      {
        key: 0,
        id: 123,
        name: '未来社区0',
        appid: 'xxadkd1cxxxx',
      },
      {
        key: 1,
        id: 12333,
        name: '未来社区1',
        appid: 'xxadkd1cxxxx',
      },
      {
        key: 2,
        id: 12333,
        name: '未来社区2',
        appid: 'xxadkxxxx',
      },
    ],
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

  /**
   * 弹窗内容显示
   * @param {Boolean} isAdd
   * @param {Object} item
   */
  handleModalStat = (isAdd, item = { name: '', appid: '' }) =>
    this.setState(({ visible }) => {
      var params = {
        visible: !visible,
        editData: item,
      }
      if (!visible) params.isAddAction = isAdd === true
      return params
    })

  handleChildEvent = (ref) => (this.childRefForm = ref)

  onSubmit = () => {
    this.childRefForm.validateFields((err, values) => {
      if (!err) {
        // this.setState({ btnLoading: true })
        // return values
        // setTimeout(() => {
        //   this.handleModalStat()
        // }, 3000)
      }
    })
  }

  handleChange = (changedFields) => {
    console.log(changedFields)
  }

  render() {
    let { state: t } = this

    return (
      <div className='page-tb'>
        <Button type='primary' icon='plus' onClick={() => this.handleModalStat(true)} style={{ marginBottom: 16 }}>
          新建
        </Button>
        <Table columns={this.columns} dataSource={t.dataSource}></Table>
        <Modal
          visible={t.visible}
          title={t.isAddAction ? '新建' : '编辑'}
          // onOk={this.handleOk}
          onCancel={this.handleModalStat}
          footer={[
            <Button key='back' onClick={this.handleModalStat}>
              取消
            </Button>,
            <Button key='submit' type='primary' loading={t.btnLoading} onClick={this.onSubmit}>
              {t.isAddAction ? '新建' : '修改'}
            </Button>,
          ]}
        >
          <ModalFormCreate {...t.editData} onChange={this.handleChange} onChildEvent={this.handleChildEvent} />
        </Modal>
      </div>
    )
  }
}

class ModalForm extends Component {
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
          {getFieldDecorator('name', nameOptions)(<Input placeholder='请输入社区名称' />)}
        </Form.Item>
        <Form.Item label='社区平台小程序appid' {...formItemLayout}>
          {getFieldDecorator('appid', appidOptions)(<Input placeholder='请输入小程序appid' />)}
        </Form.Item>
      </Form>
    )
  }
}
ModalForm.propTypes = {
  onChange: PropTypes.func.isRequired,
}

const ModalFormCreate = Form.create({
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({ value: props.name }),
      appid: Form.createFormField({ value: props.appid }),
    }
  },
})(ModalForm)
