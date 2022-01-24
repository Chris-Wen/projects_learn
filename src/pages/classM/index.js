import React, { Component } from 'react'
import { Form, Input, Select, Button, Table } from 'antd'
import PropTypes from 'prop-types'
import ModalWrapComponent from '@/components/ModalWrapComponent'
import * as API from '@/apis/classM'
import { resJudge } from '@/utils/global'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeTokenAction } from '@/store/reducers'
import qs from 'qs'

import styles from '@/styles/global.module.css'
import classNames from 'classnames/bind'
let cx = classNames.bind(styles)

class ClassManage extends Component {
  state = {
    loading: false,
    dataSource: [],
    searchParams: {},
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  }

  classStat = [
    { value: 'NOT_CLASS', name: '未开班' },
    { value: 'CAN_REGISTRATION', name: '可报名' },
    { value: 'IN_CLASS', name: '上课中' },
    { value: 'END_CLASS', name: '已结课' },
    { value: 'REGISTRATION_FULL', name: '报名人数已满' },
    { value: 'REGISTRATION_DEADLINE', name: '报名截止' },
  ]
  modalRef = React.createRef()

  // table columns config
  columns = [
    {
      align: 'center',
      title: '校区',
      dataIndex: 'campusName',
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
      key: 'num',
      render: ({ currentNumber, fullNumber, id, status }) => (
        <Button type='link' onClick={() => this.handleModalStat('classDetail', { id, status, tabIndex: '2' })}>
          {currentNumber}/{fullNumber}
        </Button>
      ),
    },
    {
      align: 'center',
      title: '班级状态',
      dataIndex: 'status',
      render: (status) => {
        for (let i = 0; i < this.classStat.length; i++) {
          const element = this.classStat[i]
          if (element.value === status) return element.name
        }
        return ''
      },
    },
    {
      align: 'left',
      title: '操作',
      width: 160,
      fixed: 'right',
      key: 'operation',
      render: (item) => {
        return (
          <>
            <Button
              type='link'
              onClick={() => this.handleModalStat('classDetail', { id: item.id, status: item.status })}
            >
              查看
            </Button>
            {item.canSign ? (
              <Button
                type='link'
                onClick={() => this.handleModalStat('classDetail', { id: item.id, status: item.status, tabIndex: '3' })}
              >
                签到
              </Button>
            ) : null}
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
  onSizeChange = (_, pageSize) => this.getData({ current: 1, pageSize })

  handleModalStat = (name = 'newClass', props = {}) => {
    let config = {
      path: `pages/classM/components/${name}.js`,
      title: name === 'newClass' ? '新建班级' : '班级详情',
      width: '80%',
      style: { top: 20 },
    }
    this.modalRef.current.initModal(config, { ...props, refresh: this.getData })
  }

  handleSearch = (params = {}) => {
    this.setState(({ searchParams }) => ({ searchParams: { ...searchParams, ...params } }))
    this.getData({ ...params, current: 1 })
  }

  getData = async (_params = {}) => {
    this.setState({ loading: true })
    let params = { ...this.state.pagination, ...this.state.searchParams, ..._params }
    try {
      delete params.total
    } catch (error) {}

    let dataSource = []
    let total = 0
    let r = await API.getClassesList(params)
    if (resJudge(r)) {
      dataSource = r.data.records
      total = r.data.total
    }
    this.setState({
      loading: false,
      dataSource,
      pagination: {
        current: params.current,
        size: params.size,
        total,
      },
    })
  }

  render() {
    const { state: t } = this
    return (
      <>
        <div className='page-tb'>
          <SearchForm handleSearch={this.handleSearch} statOption={this.classStat} />
          <Button type='primary' icon='plus' onClick={() => this.handleModalStat('newClass')} style={{ marginTop: 20 }}>
            新建班级
          </Button>
        </div>
        <div className='page-bt' style={{ borderTop: '20px solid #eff3f6' }}>
          <Table
            pagination={{
              ...t.pagination,
              showSizeChanger: true,
              showTotal: (total) => `共${total}条数据`,
              onShowSizeChange: this.onSizeChange,
              onChange: this.onPageChange,
            }}
            rowKey='id'
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
    static propTypes = {
      statOption: PropTypes.array.isRequired,
      handleSearch: PropTypes.func,
    }

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
            {getFieldDecorator('name')(<Input placeholder='请输入班级名称' allowClear />)}
          </Form.Item>
          <Form.Item label='状态'>
            {getFieldDecorator('status')(
              <Select placeholder='请选择' style={{ minWidth: 150 }} allowClear>
                {this.props?.statOption?.map((item) => (
                  <Select.Option value={item.value} key={item.value}>
                    {item.name}
                  </Select.Option>
                ))}
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

export default connect(({ global: { token } }) => ({ token }), { changeTokenAction })(withRouter(ClassManage))
