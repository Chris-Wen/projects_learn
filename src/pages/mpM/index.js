import React, { Component } from 'react'
import { Button, Table, Modal, Form, Input } from 'antd'

/**
 * 小程序管理页面
 * @returns Component
 */
export default class MpMange extends Component {
  state = {
    visible: false,
    loading: false,
    isAddAction: false,
    editData: null,
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

  // table title
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
      render: (item) => {
        return <div onClick={() => this.handleModalStat(false, item)}>编辑</div>
      },
    },
  ]

  /**
   * 弹窗内容显示
   * @param {Boolean} isAdd
   * @param {Object} item
   */
  handleModalStat = (isAdd, item) => {
    let { visible } = this.state
    let params = {
      visible: !visible,
    }
    if (visible) params.isAddAction = isAdd === true
    if (item) params.editData = item
    this.setState(params)
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
            <Button key='submit' type='primary' loading={t.loading} onClick={this.handle}>
              {t.isAddAction ? '新建' : '修改'}
            </Button>,
          ]}
        >
          <Form>
            <Form.Item label='社区名称' required>
              <Input placeholder='请输入社区名称' />
            </Form.Item>
            <Form.Item label='社区平台小程序appid' required>
              <Input placeholder='请输入小程序appid' />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
