import React, { Component } from 'react'
import { Form, Input, Select, Button, Tabs } from 'antd'
import MainTable from './components/mainTable'
import ModalWrapComponent from '@/components/ModalWrapComponent'

export default class CourseManage extends Component {
  state = {
    loading: false,
    dataSource: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    activeTab: '0',
    tabs: [
      { value: '0', name: '全部' },
      { value: '1', name: '邻里学堂' },
      { value: '2', name: '惠普托育' },
    ],
  }
  modalRef = React.createRef()

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

  handleSearch = (params) => {
    params = {
      ...params,
      current: 1,
    }
    this.getData(params)
  }

  handleChangeTab = (activeTab) => {
    this.setState(() => ({
      activeTab,
    }))

    this.getData()
  }

  handleModalStat = (name = 'newCourse', props = {}) => {
    let config = {
      path: `pages/courseM/components/${name}/index.js`,
      title: name === 'newCourse' ? '新建课程' : '课程详情',
      width: '80%',
      style: { top: 20 },
    }
    this.modalRef.current.initModal(config, props)
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
          <Button
            type='primary'
            icon='plus'
            onClick={() => this.handleModalStat('newCourse')}
            style={{ marginTop: 20 }}
          >
            新建课程
          </Button>
        </div>
        <div className='page-tb' style={{ borderTop: '20px solid #eff3f6' }}>
          <Tabs activeKey={t.activeTab} onChange={this.handleChangeTab}>
            {t.tabs.map((item, i) => (
              <Tabs.TabPane tab={item.name} key={item.value}></Tabs.TabPane>
            ))}
          </Tabs>
          <MainTable
            dataSource={t.dataSource}
            loading={t.loading}
            pagination={t.pagination}
            onSizeChange={this.onSizeChange}
            onChange={this.onPageChange}
          />
          <ModalWrapComponent ref={this.modalRef} />
        </div>
      </>
    )
  }
}
CourseManage.RouterName = '课程管理'

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
          <Form.Item label='课程名称'>
            {getFieldDecorator('className')(<Input placeholder='请输入课程名称' allowClear />)}
          </Form.Item>
          <Form.Item label='课程类型'>
            {getFieldDecorator('courseStat')(
              <Select placeholder='请选择' style={{ minWidth: 150 }} allowClear>
                <Select.Option value='0'>全部</Select.Option>
                <Select.Option value='1'>邻里学堂</Select.Option>
                <Select.Option value='2'>惠普托育</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label='课程状态'>
            {getFieldDecorator('state')(
              <Select placeholder='请选择' style={{ minWidth: 150 }} allowClear>
                <Select.Option value='1'>已上架</Select.Option>
                <Select.Option value='2'>已下架</Select.Option>
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
