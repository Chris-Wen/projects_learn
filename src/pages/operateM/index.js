import React, { Component } from 'react'
import { Button, Table, Modal, Form, Input, Popconfirm } from 'antd'
import Image from '@/components/Image'
import styles from '@/styles/global.module.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)

export default class OperationManage extends Component {
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
      title: '运营位链接',
      dataIndex: 'link',
      className: cx('td-max-width'),
      ellipsis: true,
    },
    {
      align: 'center',
      title: '运营位图片',
      key: 'pic',
      dataIndex: 'pic',
      render: (pic) => <Image style={{ width: '130px', maxHeight: '80px' }} src={pic} />,
    },
    {
      align: 'center',
      title: '被点击数',
      dataIndex: 'pv',
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
          <Popconfirm
            placement='left'
            onConfirm={() => this.handleRowData(item, 'state')}
            okText='确定'
            cancelText='取消'
            title='确认下架？'
          >
            <span className={cx('btn', 'primary-color')}>下架</span>
          </Popconfirm>
        ) : (
          <>
            <span className={cx('btn', 'primary-color')} onClick={() => this.handleRowData(item, 'edit')}>
              编辑
            </span>
            <Popconfirm
              placement='left'
              onConfirm={() => this.handleRowData(item, 'state')}
              okText='确定'
              cancelText='取消'
              title='确认下架？'
            >
              <span className={cx('btn', 'primary-color')}>上架</span>
            </Popconfirm>
            <Popconfirm
              placement='left'
              onConfirm={() => this.handleRowData(item, 'delete')}
              okText='确定'
              cancelText='取消'
              title='确认删除？'
            >
              <span className={cx('btn', 'danger-color')}>删除</span>
            </Popconfirm>
          </>
        )
      },
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
          id: `${(Math.random() * 1000).toFixed(0)}`,
          pv: `${(Math.random() * 1000).toFixed(0)}`,
          link: 'https://lanhuapp.com/web/#/item/project/product?tid=390df24f-b6b5-4b13-bcfe-0185b2f702ee&pid=db2721aa-ce2e-4ed0-8097-c1395c124d3a&versionId=0a5429d5-b656-4e11-8183-5c27432b908d&docId=ddc2c78c-10ad-43b6-9a7d-714b60c62280&docType=axure&pageId=0ce57a633bb046619e9fbbad8362a9ad&image_id=ddc2c78c-10ad-43b6-9a7d-714b60c62280&parentId=b0b1862e-a04a-4dd1-b1dd-b3345fe7c4e4',
          pic: 'https://pic1.zhimg.com/v2-9a15080f9425446e294eedb7a7a15ad6_1440w.jpg?source=172ae18b',
          status: Math.random() > 0.5,
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

  /**
   * @description 对这行数据进行操作
   * @param {Obj} data
   * @param {String} type : 操作类型
   */
  handleRowData(data, type) {
    if (type === 'edit') {
      this.handleModalStat(false, data)
    } else if (type === 'delete') {
    } else {
    }
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

OperationManage.RouterName = '运营位管理'

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
        rules: [{ required: true, whitespace: true, message: '请输入链接' }],
      }
      return (
        <Form>
          <Form.Item label='社区名称' {...formItemLayout}>
            {getFieldDecorator('name', nameOptions)(<Input placeholder='请输入' allowClear />)}
          </Form.Item>
          <Form.Item label='跳转链接' {...formItemLayout}>
            {getFieldDecorator('appid', appidOptions)(<Input placeholder='请输入' allowClear />)}
          </Form.Item>
        </Form>
      )
    }
  },
)
