import React, { Component } from 'react'
import { Form, Input, Select, Button, Modal } from 'antd'

export default class ClassManage extends Component {
  state = {
    modalVisible: false,
    loading: false,
    btnLoading: false,
    showClassInfo: false,
  }

  handleModalStat = (showClassInfo = false) => {
    this.setState(({ modalVisible }) => {
      return {
        modalVisible: !modalVisible,
        showClassInfo,
      }
    })
  }

  render() {
    const { state: t } = this
    return (
      <>
        <div className='page-tb'>
          <SearchForm handleSearch={this.handleSearch} />
          <Button type='primary' icon='plus' onClick={() => this.handleModalStat(true)} style={{ marginTop: 20 }}>
            新建班级
          </Button>
        </div>
        <div className='page-bt' style={{ borderTop: '20px solid #eff3f6' }}></div>
        <Modal
          title={t.showClassInfo ? '班级详情' : '新建班级'}
          visible={t.modalVisible}
          style={{ top: 20 }}
          width='85%'
          footer={null}
          onCancel={this.handleModalStat}
        >
          {t.modalVisible ? t.showClassInfo ? <div>课程详情</div> : <div>新建班级</div> : ''}
        </Modal>
      </>
    )
  }
}
ClassManage.RouterName = '班级管理'

const SearchForm = Form.create({})(
  class extends Component {
    handleSearch = (e) => {
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        !err && typeof this.props.handleSearch === 'function' && this.props.handleSearch(values)
      })
    }

    render() {
      const { getFieldDecorator, resetFields } = this.props.form
      return (
        <Form layout='inline' onSubmit={this.handleSearch}>
          <Form.Item label='班级名称'>
            {getFieldDecorator('className')(<Input placeholder='请输入班级名称' allowClear />)}
          </Form.Item>
          <Form.Item label='状态'>
            {getFieldDecorator('state')(
              <Select placeholder='请选择' style={{ minWidth: 150 }} allowClear>
                <Select.Option value='1'>哇哈哈</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              查询
            </Button>
            &nbsp;
            <Button
              onClick={() => {
                resetFields()
                this.handleSearch()
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      )
    }
  },
)
