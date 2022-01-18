import PropTypes from 'prop-types'
import styles from '@/styles/global.module.css'
import classNames from 'classnames/bind'
import { Popconfirm, Table, Button } from 'antd'

let cx = classNames.bind(styles)

const MainTable = (props) => {
  let ConfirmComponent = (props) => {
    let bool = props.courseAuditState === 6

    return (
      <Popconfirm
        placement='topRight'
        title={
          bool ? (
            '确认上架？'
          ) : (
            <span>
              下架课程后，该课程将无法
              <br />
              报名，是否确认下架？
            </span>
          )
        }
        onConfirm={props.onConfirm}
      >
        <Button className={cx('min-padding')} type='link'>
          {bool ? '上架' : '下架'}
        </Button>
      </Popconfirm>
    )
  }
  let columns = [
    {
      align: 'center',
      title: '校区',
      dataIndex: 'campusName',
      className: cx('td-max-width'),
      ellipsis: true,
    },
    {
      align: 'center',
      title: '课程名称',
      className: cx('td-max-width'),
      ellipsis: true,
      dataIndex: 'courseName',
    },
    {
      align: 'center',
      title: '课程类型',
      width: 120,
      dataIndex: 'courseTypeName',
    },
    {
      align: 'center',
      title: '课程状态',
      dataIndex: 'courseAuditState',
      render: (s) => (
        <span className={cx(s === 1 ? 'success-color' : 'danger-color')}>{s === 1 ? '已上架' : '已下架'}</span>
      ),
    },
    {
      align: 'left',
      title: '操作',
      width: 200,
      key: 'operation',
      render: (item) => {
        return (
          <>
            <Button className={cx('min-padding')} type='link' onClick={() => props.showDetail('courseDetail', item.id)}>
              查看
            </Button>
            {item.courseAuditState === 6 ? (
              <Button className={cx('min-padding')} type='link' onClick={() => props.showDetail('newCourse', item.id)}>
                编辑
              </Button>
            ) : null}

            <ConfirmComponent onConfirm={() => props.onStateChange(item.id)} courseAuditState={item.courseAuditState} />
          </>
        )
      },
    },
  ]

  return <Table columns={columns} {...props} />
}

MainTable.propTypes = {
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  pagination: PropTypes.shape({
    total: PropTypes.number,
    current: PropTypes.number,
    pageSize: PropTypes.number,
    showSizeChanger: PropTypes.bool,
    showTotal: PropTypes.func,
  }),
  onSizeChange: PropTypes.func,
  onChange: PropTypes.func,
  onConfirm: PropTypes.func,
}

MainTable.defaultProps = {
  dataSource: [],
  loading: false,
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `共${total}条数据`,
  },
  onSizeChange: () => {},
  onChange: () => {},
  onConfirm: () => {},
}

export default MainTable
