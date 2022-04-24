import React, { Component } from 'react'
import { Button, Table, Form, Input, Popconfirm, Select, message, Popover, Icon } from 'antd'
import Image from '@/components/Image'
import ModalWrapComponent from '@/components/ModalWrapComponent'
import * as API from '@/apis/location'
import { resJudge } from '@/utils/global'
import { debounce } from '@/utils/index'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { changeTokenAction } from '@/store/reducers'
import PropTypes from 'prop-types'
import qs from 'qs'

import styles from '@/styles/global.module.css'
import classNames from 'classnames/bind'
let cx = classNames.bind(styles)

class OperationManage extends Component {
  state = {
    visible: false,
    btnLoading: false,
    isAddAction: false,
    loading: false,
    editData: { imageUrl: '', jumpUrl: '' },
    searchParams: {},
    dataSource: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
    statOption: [
      { name: '已上架', value: '1' },
      { name: '已下架', value: '0' },
    ],
  }

  modalRef = React.createRef()

  // table columns config
  columns = [
    {
      align: 'center',
      title: '学习场所名称',
      dataIndex: 'name',
      className: cx('td-max-width'),
      ellipsis: true,
    },
    {
      align: 'center',
      title: '场所图片',
      dataIndex: 'coverUrl',
      render: (imageUrl) => <Image style={{ width: '130px', maxHeight: '80px' }} src={imageUrl} />,
    },
    {
      align: 'center',
      title: (
        <Popover
          placement='right'
          content={
            <>
              <p>点击导航一次+2</p>
              <p>点击拨打电话一次+2</p>
              <p>进入详情+1</p>
              <p>同一用户多次点击同个场所累加。</p>
            </>
          }
          title='热度规则'
        >
          当前热度&nbsp;
          <Icon type='question-circle' style={{ color: '#ccc' }} />
        </Popover>
      ),
      dataIndex: 'hotScore',
    },
    {
      align: 'center',
      title: '场所状态',
      dataIndex: 'status',
      render: (status) => (
        <span className={cx(status ? 'success-color' : 'danger-color')}>{status ? '已上架' : '已下架'}</span>
      ),
    },
    {
      align: 'center',
      title: '操作',
      width: 250,
      key: 'operation',
      render: (item) => (
        <>
          <span className={cx('btn', 'primary-color')} onClick={() => this.handleRowData(item.id, 'detail')}>
            查看
          </span>
          {item.status ? (
            <PopoverButton
              onConfirm={() => this.handleRowData(item.id, 'state')}
              content='确认下架？'
              btnText='下架'
              styleClass={cx('btn', 'primary-color')}
            />
          ) : (
            <>
              <span className={cx('btn', 'primary-color')} onClick={() => this.handleRowData(item.id, 'edit')}>
                编辑
              </span>
              <PopoverButton
                onConfirm={() => this.handleRowData(item.id, 'state')}
                content='确认上架？'
                btnText='上架'
                styleClass={cx('btn', 'primary-color')}
              />
            </>
          )}
        </>
      ),
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

  getData = async (params = {}) => {
    this.setState({ loading: true })
    let { current, pageSize } = { ...this.state.pagination, ...params }
    let { name, status } = params
    let _params = { current, size: pageSize }
    if (name) _params.name = name
    if (status) _params.status = status

    let dataSource = []
    let total = 0
    let r = await API.getLocationList(_params)
    if (resJudge(r)) {
      dataSource = r.data.records
      total = r.data.total
    }
    this.setState({
      loading: false,
      dataSource,
      pagination: { current, pageSize, total },
    })
  }

  /**
   * @description 弹窗内容显示
   * @param {Boolean} isAdd
   * @param {Object} editData
   */
  handleModalStat = (name, props = {}) => {
    let config = {
      path: `pages/locationM/components/${name}.js`,
      title: name === 'newLocation' ? '新增/编辑学习场所' : '学习场所详情',
      width: '80%',
      style: { top: 20 },
    }
    this.modalRef.current.initModal(config, { ...props, refresh: this.getData })
  }

  handleAddLocation = () => this.handleModalStat('newLocation')

  /**
   * @description 对这行数据进行操作
   * @param {Obj} data
   * @param {String} type : 操作类型
   */
  handleRowData = debounce(async (data, type) => {
    if (type === 'state') {
      let r = await API.changeLStat(data)
      if (resJudge(r)) {
        message.success('操作成功')
        this.getData()
      } else {
        message.success('操作失败')
      }
    } else {
      let r = await API.getLocationInfo(data)
      if (resJudge(r)) {
        this.handleModalStat(type === 'edit' ? 'newLocation' : 'locationDetail', { dataSource: r.data })
      }
    }
  }, 500)

  handleChildEvent = (ref) => (this.childRefForm = ref)

  handleSearch = (params) => this.getData({ ...params, current: 1 })

  render() {
    let { state: t } = this

    return (
      <div className='page-tb'>
        <SearchForm statOption={t.statOption} handleSearch={this.handleSearch} />
        <Button type='primary' icon='plus' onClick={this.handleAddLocation} style={{ marginBottom: 16, marginTop: 10 }}>
          新建学习场所
        </Button>
        <Table
          pagination={{
            ...t.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共${total}条数据`,
            onShowSizeChange: this.onPageChange,
            onChange: this.onPageChange,
          }}
          columns={this.columns}
          dataSource={t.dataSource}
          loading={t.loading}
          rowKey='id'
        ></Table>
        <ModalWrapComponent ref={this.modalRef} />
      </div>
    )
  }
}

const PopoverButton = (props) => {
  return (
    <Popconfirm placement='left' onConfirm={props.onConfirm} okText='确定' cancelText='取消' title={props.content}>
      <span className={props.styleClass}>{props.btnText}</span>
    </Popconfirm>
  )
}

OperationManage.RouterName = '学习地图'

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
          <Form.Item label='学习场所名称'>
            {getFieldDecorator('name')(<Input placeholder='请输入名称' allowClear />)}
          </Form.Item>
          <Form.Item label='场所状态'>
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

export default connect(({ global: { token } }) => ({ token }), { changeTokenAction })(withRouter(OperationManage))
