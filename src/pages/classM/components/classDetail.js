import React from 'react'
import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import DetailTabComponent from './detailTabComponent'
import ListTabComponent from './listTabComponent'
import RecordTabComponent from './recordTabComponent'

function ClassDetail(props = {}) {
  return (
    <Tabs defaultActiveKey={props.tabIndex}>
      <Tabs.TabPane tab='班级详情' key='1'>
        <DetailTabComponent {...props} />
      </Tabs.TabPane>
      <Tabs.TabPane tab='花名册' key='2'>
        <ListTabComponent {...props} />
      </Tabs.TabPane>
      <Tabs.TabPane tab='签到记录' key='3'>
        <RecordTabComponent {...props} />
      </Tabs.TabPane>
    </Tabs>
  )
}

ClassDetail.propTypes = {
  tabIndex: PropTypes.string,
}

ClassDetail.defaultProps = {
  tabIndex: '1',
}

export default ClassDetail
