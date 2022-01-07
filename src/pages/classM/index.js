import React, { Component } from 'react'
import { Form, Input, Select, Button, Table } from 'antd'
import ModalWrapComponent from '@/components/ModalWrapComponent'
import styles from '@/styles/global.module.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)

export default class ClassManage extends Component {
  state = {
    loading: false,
    dataSource: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showTotal: (total) => `共${total}条数据`,
    },
  }
  modalRef = React.createRef()

  // table columns config
  columns = [
    {
      align: 'center',
      title: '校区',
      dataIndex: 'campus',
      className: cx('td-max-width'),
      ellipsis: true,
    },
    {
      align: 'center',
      title: '班级名称',
      className: cx('td-max-width'),
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: '班级人数',
      width: 120,
      dataIndex: 'num',
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (item) => (
        <span className={cx('btn', 'primary-color')} onClick={() => this.handleJump()}>
          {item}
        </span>
      ),
    },
    {
      align: 'center',
      title: '班级状态',
      dataIndex: 'status',
      render: (status) => {
        return '报名截止'
      },
    },
    {
      align: 'left',
      title: '操作',
      width: 150,
      key: 'operation',
      render: (item) => {
        return (
          <>
            <span className={cx('btn', 'primary-color')} onClick={() => this.handleModalStat('classDetail', item)}>
              查看
            </span>
            {item.status > 0.3 ? (
              <span
                className={cx('btn', 'primary-color')}
                onClick={() => this.handleModalStat('classDetail', { ...item, tabIndex: '3' })}
              >
                签到
              </span>
            ) : (
              ''
            )}
          </>
        )
      },
    },
  ]

  componentDidMount() {
    this.getData()
  }
  onPageChange = (current, pageSize) => {
    this.getData({ current, pageSize })
  }
  onSizeChange = (current, pageSize) => {
    this.getData({
      current: 1,
      pageSize,
    })
  }

  handleModalStat = (name = 'newClass', props = {}) => {
    let config = {
      path: `pages/classM/components/${name}.js`,
      title: name === 'newClass' ? '新建班级' : '班级详情',
      width: '80%',
      style: { top: 20 },
    }
    this.modalRef.current.initModal(config, props)
  }

  handleSearch = (params) => {
    params = {
      ...params,
      current: 1,
    }
    this.getData(params)
  }

  getData = (params = {}) => {
    this.setState({ loading: true })
    let { current, pageSize } = { ...this.state.pagination, ...params }
    params = { current, pageSize }
    let dataSource = []
    setTimeout(() => {
      for (let i = 0; i < pageSize; i++) {
        dataSource.push({
          key: i,
          id: `${(Math.random() * 1000).toFixed(0)}`,
          num: `${(Math.random() * 1000).toFixed(0)}`,
          campus: '东信社区',
          name: '小葵花课堂',
          status: Math.random() > 0.5,
        })
      }
      var total = Math.ceil(Math.random() * 100)
      this.setState(({ pagination }) => {
        return {
          loading: false,
          dataSource,
          pagination: {
            ...pagination,
            current,
            pageSize,
            total,
          },
        }
      })
    }, 1000)
  }

  render() {
    const { state: t } = this
    return (
      <>
        <div className='page-tb'>
          <SearchForm handleSearch={this.handleSearch} />
          <Button type='primary' icon='plus' onClick={() => this.handleModalStat('newClass')} style={{ marginTop: 20 }}>
            新建班级
          </Button>
        </div>
        <div className='page-bt' style={{ borderTop: '20px solid #eff3f6' }}>
          <Table
            pagination={{
              ...t.pagination,
              onShowSizeChange: this.onSizeChange,
              onChange: this.onPageChange,
            }}
            columns={this.columns}
            dataSource={t.dataSource}
            loading={t.loading}
          ></Table>
        </div>
        <ModalWrapComponent ref={this.modalRef} />
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
              onClick={(e) => {
                resetFields()
                this.handleSearch(e)
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
