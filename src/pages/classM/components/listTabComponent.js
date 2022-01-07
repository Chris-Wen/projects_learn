import React, { Component } from 'react'
import { Table } from 'antd'
import styles from '@/styles/global.module.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)

export default class ListTabComponent extends Component {
  state = {
    dataSource: [
      {
        id: 123,
        name: '灰蒙蒙',
        phone: 18899999999,
        nickname: '我觉得哈哈动画动画哈哈动画',
        status: 0,
        money: 1000,
        idNo: 123333333,
      },
      {
        id: 12123,
        name: '1灰蒙蒙',
        phone: 18899999999,
        nickname: '我觉得哈哈动画',
        status: 1,
        money: 900,
        idNo: 12933333,
      },
      {
        id: 3,
        name: '1灰蒙蒙',
        phone: 18899999999,
        nickname: '我觉得哈哈动画',
        status: 2,
        money: 100,
        idNo: 1333,
      },
    ],
    loading: false,
  }

  columns = [
    {
      align: 'center',
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      align: 'center',
      title: '学员信息',
      dataIndex: 'name',
      render: (text, record) => (
        <>
          <div style={{ color: '#000' }}>{text || ''}</div>
          <div>联系方式：{record.phone || ''}</div>
        </>
      ),
    },
    {
      align: 'center',
      title: '预约人',
      className: cx('td-max-width'),
      ellipsis: true,
      dataIndex: 'nickname',
    },
    {
      align: 'center',
      title: '缴费状态',
      key: 'stat',
      render: (item) => <StatusText {...item} />,
    },
    {
      align: 'center',
      title: '操作',
      dataIndex: 'status',
      render: (stat, item) => (
        <>
          {stat === 0 ? (
            <>
              <span className={cx('btn', 'primary-color')}>缴费</span> |
              <span className={cx('btn', 'danger-color')}>删除</span>
            </>
          ) : stat === 1 ? (
            <span className={cx('btn', 'danger-color')}>退款</span>
          ) : (
            <span className={cx('btn', 'primary-color')}>查看退款详情</span>
          )}
        </>
      ),
    },
  ]

  render() {
    let { state: t } = this
    return (
      <div>
        <Table
          pagination={false}
          columns={this.columns}
          rowKey='id'
          dataSource={t.dataSource}
          loading={t.loading}
        ></Table>
      </div>
    )
  }
}

function StatusText(props) {
  switch (props.status) {
    case 0:
      return <span className={cx('primary-color')}>未缴费</span>
    case 1:
      return (
        <>
          已缴费<br></br> 收据单号：{props.idNo || ''}
        </>
      )
    case 2:
      return (
        <>
          已退款<br></br>退款金额： {props.money || ''}
        </>
      )
    default:
      break
  }
  return <></>
}
