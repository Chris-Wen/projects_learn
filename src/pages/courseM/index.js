import React, { Component } from 'react'
import { Form, Input, Select, Button, Tabs } from 'antd'
import MainTable from './components/mainTable'
import ModalWrapComponent from '@/components/ModalWrapComponent'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCourseTypeAction } from '@/store/reducers/course/action'
import { changeTokenAction } from '@/store/reducers'
import { getCourseList, changeCourseStat, getCourseDetail } from '@/apis/course'
import { resJudge } from '@/utils/global'
import { withRouter } from 'react-router-dom'
import qs from 'qs'

class CourseManage extends Component {
  static propTypes = {
    courseType: PropTypes.array.isRequired,
    getCourseTypeAction: PropTypes.func.isRequired,
  }

  state = {
    loading: false,
    dataSource: [],
    searchParams: {},
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    activeTab: '0',
    courseState: [
      { id: 1, name: '已上架' },
      { id: 6, name: '已下架' },
    ],
  }
  modalRef = React.createRef()

  componentDidMount() {
    let { search } = this.props.location
    let { token } = qs.parse(search.slice(1))
    if (!this.props.token || this.props.token !== token) {
      token && this.props.changeTokenAction(token)
    }
    this.getData()
    !this.props.courseType.length && this.props.getCourseTypeAction()
  }
  onPageChange = ({ current, pageSize }) => this.getData({ current, pageSize })

  onSizeChange = (current, pagesize) => this.getData({ current: 1, pagesize })

  handleSearch = (params = {}) => {
    this.setState(({ searchParams }) => ({ searchParams: { ...searchParams, ...params } }))
    params = {
      ...params,
      current: 1,
    }
    if (params.courseType !== this.state.activeTab) {
      this.setState(() => ({ activeTab: (params.courseType ?? '0').toString() }))
    }
    this.getData(params)
  }

  handleChangeTab = (activeTab) => {
    this.setState(() => ({ activeTab }))
    this.getData({ courseType: parseInt(activeTab), current: 1 })
  }

  handleStat = async (id) => {
    let r = await changeCourseStat(id)
    resJudge(r) && this.getData()
  }

  handleDetail = async (name, id) => {
    let r = await getCourseDetail(id)
    resJudge(r) &&
      this.handleModalStat(name, name === 'newCourse' ? { dataSource: r.data, refresh: this.getData } : r.data)
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

  getData = async (_params = {}) => {
    this.setState({ loading: true })
    let params = { ...this.state.pagination, ...this.state.searchParams, ..._params }
    params.size = params.pageSize
    if (!params.courseType) params.courseType = undefined
    try {
      delete params.total
      delete params.pageSize
    } catch (error) {}

    let dataSource = []
    let r = await getCourseList(params)
    if (resJudge(r)) {
      dataSource = r.data.records
      let total = r.data.total
      this.setState({
        loading: false,
        dataSource,
        pagination: {
          current: params.current,
          pagesize: params.pagesize,
          total,
        },
      })
    }
  }

  render() {
    const { state: t } = this
    let tabsList = [{ id: 0, name: '全部' }, ...this.props.courseType]
    return (
      <>
        <div className='page-tb'>
          <SearchForm handleSearch={this.handleSearch} tabsList={tabsList} courseState={t.courseState} />
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
            {tabsList.map((item) => (
              <Tabs.TabPane tab={item.name} key={item.id}></Tabs.TabPane>
            ))}
          </Tabs>
          <MainTable
            dataSource={t.dataSource}
            loading={t.loading}
            pagination={t.pagination}
            onSizeChange={this.onSizeChange}
            onChange={this.onPageChange}
            onStateChange={this.handleStat}
            showDetail={this.handleDetail}
            rowKey='id'
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
    static propTypes = {
      tabsList: PropTypes.array.isRequired,
      courseState: PropTypes.array.isRequired,
      handleSearch: PropTypes.func.isRequired,
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
          <Form.Item label='课程名称'>
            {getFieldDecorator('courseName')(<Input placeholder='请输入课程名称' allowClear />)}
          </Form.Item>
          <Form.Item label='课程类型'>
            {getFieldDecorator('courseType')(
              <Select placeholder='请选择' style={{ minWidth: 150 }} allowClear>
                {this.props.tabsList.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label='课程状态'>
            {getFieldDecorator('courseAuditState')(
              <Select placeholder='请选择' style={{ minWidth: 150 }} allowClear>
                {this.props.courseState.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
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

export default connect(({ course: { courseType }, global: { token } }) => ({ courseType, token }), {
  getCourseTypeAction,
  changeTokenAction,
})(withRouter(CourseManage))
