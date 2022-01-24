import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, message, Modal, Select, Switch } from 'antd'
import { getSignList, getSingleList, sign, updateSign } from '@/apis/classM'
import { resJudge } from '@/utils/global'
import moment from 'moment'

export default class RecordTabComponent extends Component {
  state = {
    dataSource: [],
    columns: [],
    loading: false,
    status: {},
    current: moment().format('YYYY-MM-DD'),
    dateList: [],
  }

  constColumns = [
    {
      align: 'center',
      title: '学员姓名',
      dataIndex: 'studentName',
      width: 120,
      fixed: 'left',
    },
  ]

  modalRef = React.createRef()

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    if (this.props.id) {
      this.setState({ loading: true })
      let r = await getSignList(this.props.id)
      let dataSource = [],
        columns = [...this.constColumns],
        dateList = [],
        status = {}
      if (resJudge(r)) {
        let { signDateList = [], signMap = {}, studentList = [], signType } = r.data
        status = {
          changeSignStatus: r.data?.changeSignStatus ?? false,
          todaySignStatus: r.data?.todaySignStatus ?? false,
          signType,
        }

        dataSource = studentList
        let { current } = this.state
        dateList = [...new Set(signDateList)].sort((a, b) => (b > a ? 1 : -1))

        if (dateList?.length) {
          dataSource.forEach((item) => {
            for (const key in dateList) {
              if (Object.hasOwnProperty.call(dateList, key)) {
                const element = dateList[key]
                item[element] = null
              }
            }
            for (const key of dateList) {
              if (key) item[key] = null
            }
            let { studentRegId } = item
            if (studentRegId && Object.keys(signMap).includes(studentRegId.toString())) {
              let signRecords = signMap[studentRegId]
              Object.keys(item).forEach((k) => signRecords.includes(k) && (item[k] = true))
            }
          })

          for (const key of dateList) {
            if (key) {
              let isCurrent = key === current
              columns.push({
                align: 'center',
                title: isCurrent ? `${key}(今日签到)` : key,
                className: isCurrent ? 'colored-bg' : '',
                width: 120,
                dataIndex: key,
                render: (val) =>
                  val ? '已签到' : isCurrent ? <span></span> : <span style={{ color: 'red' }}>缺勤</span>,
              })
            }
          }
          columns.length < 5 && columns.push({})
        }
      }
      this.setState({ dataSource, columns, dateList, loading: false, status })
    }
  }

  handleSign = (isCurrent = false) => {
    let params
    if (isCurrent) {
      params = this.state.current
    } else {
      let {
        dateList,
        status: { todaySignStatus },
      } = this.state

      if (todaySignStatus) dateList.splice(0, 1)
      params = dateList
    }
    this.modalRef.current.init(params)
  }

  render() {
    let {
      columns,
      dataSource,
      loading,
      status: { changeSignStatus, todaySignStatus, signType },
    } = this.state
    let classId = this.props.id
    return (
      <>
        <div style={{ textAlign: 'right' }}>
          {changeSignStatus ? (
            <>
              <Button type='primary' onClick={() => this.handleSign(false)}>
                修改签到
              </Button>
              &nbsp;&nbsp;
            </>
          ) : null}
          {todaySignStatus ? (
            <Button type='primary' onClick={() => this.handleSign(true)}>
              今日签到
            </Button>
          ) : null}
        </div>

        <Table
          pagination={false}
          columns={columns}
          rowKey='studentRegId'
          dataSource={dataSource}
          loading={loading}
          scroll={{ x: '65vh', y: '60vh' }}
        ></Table>
        <WrapDialog
          ref={this.modalRef}
          callback={this.getData}
          classId={classId}
          todaySignStatus={todaySignStatus}
          signType={signType}
        />
      </>
    )
  }
}

//弹窗
class WrapDialog extends Component {
  static propTypes = {
    classId: PropTypes.any.isRequired,
    callback: PropTypes.func.isRequired,
    signType: PropTypes.any,
    todaySignStatus: PropTypes.bool,
  }

  state = {
    visible: false,
    title: '',
    signDate: null,
    signDateList: [],
    data: [],
    loading: false,
  }

  columns = [
    {
      align: 'center',
      title: '学员姓名',
      dataIndex: 'studentName',
    },
    {
      align: 'center',
      title: '签到状态',
      dataIndex: 'signStatus',
      render: (val, item, index) => (
        <Switch
          checkedChildren='签到'
          unCheckedChildren='缺勤'
          checked={!!val}
          disabled={!this.state.signDateList.length && this.props.signType === 1}
          onChange={(s) => this.changeState(index, s)}
        />
      ),
    },
  ]

  init = (date) => {
    let isCurrent = !Array.isArray(date)
    let title = isCurrent ? `签到窗口（${date}）` : '修改签到'

    this.getData(isCurrent ? date : date[0])
    this.setState(() => ({
      title,
      visible: true,
      loading: true,
      signDate: isCurrent ? date : date[0],
      signDateList: isCurrent ? [] : date,
    }))
  }

  getData = async (signDate) => {
    let r = await getSingleList({ classId: this.props.classId, signDate })
    resJudge(r) && this.setState({ data: r.data, loading: false })
  }

  onCancel = () => this.setState({ visible: false })

  changeState = (index, val) =>
    this.setState(({ data }) => {
      data[index] && (data[index].signStatus = val)
      return { data }
    })

  handleSubmit = async () => {
    var params = {
      classId: this.props.classId,
      signDate: this.state.signDate,
      signList: this.state.data,
    }
    let r = await (this.state.signDateList.length ? updateSign(params) : sign(params))
    if (resJudge(r)) {
      message.success('操作成功')
      setTimeout(() => {
        this.onCancel()
        this.props?.callback()
      }, 1000)
    }
  }

  handleChange = (signDate) => {
    if (signDate) {
      this.setState({ loading: true, signDate: signDate })
      this.getData(signDate)
    }
  }

  render() {
    let { visible, title, signDateList, signDate, data, loading } = this.state

    return (
      <Modal
        visible={visible}
        title={title}
        footer={
          !signDateList.length && this.props.signType === 1 ? (
            '请到课的学生到扫码机前进行签到'
          ) : (
            <>
              <Button type='info' onClick={this.onCancel}>
                取消
              </Button>
              <Button type='primary' onClick={this.handleSubmit}>
                确定
              </Button>
            </>
          )
        }
        onCancel={this.onCancel}
      >
        {signDateList?.length ? (
          <div>
            上课日期：
            <Select defaultValue={signDate} onChange={this.handleChange} style={{ width: 200 }}>
              {signDateList?.map((item) => (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </div>
        ) : null}
        <Table
          pagination={false}
          columns={this.columns}
          rowKey='studentRegId'
          dataSource={data}
          loading={loading}
          scroll={{ y: '50vh' }}
        ></Table>
      </Modal>
    )
  }
}
