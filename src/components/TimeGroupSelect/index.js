import React, { Component } from 'react'
import { WEEKOPTIONS } from '@/utils/global'
import PropTypes from 'prop-types'
import { Row, Col, Select, TimePicker, Button } from 'antd'
import moment from 'moment'

// 周几 时间联合组件
export default class ClassTimeGroup extends Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props)
    let timeGroup = props.value || [{ week: null, startTime: null, endTime: null }]
    this.state = {
      timeGroup,
      options: WEEKOPTIONS,
    }
  }

  addLine = () => {
    if (this.state.timeGroup.length >= 7) return

    this.setState(({ timeGroup }) => {
      timeGroup.push({
        week: null,
        startTime: null,
        endTime: null,
      })
      this.props.onChange && this.props.onChange(timeGroup)
      return { timeGroup }
    })
  }

  handleChange = (i, type, ...arg) => {
    let timeGroup = this.state.timeGroup
    timeGroup[i][type] = type === 'week' ? arg[0] : arg[1]

    this.props.onChange && this.props.onChange(timeGroup)

    this.setState({ timeGroup })
  }

  delLine = (i) => {
    this.setState(({ timeGroup }) => {
      timeGroup.splice(i, 1)
      this.props.onChange && this.props.onChange(timeGroup)
      return { timeGroup }
    })
  }

  render() {
    let { timeGroup, options } = this.state

    return (
      <Row>
        <Col span={20}>
          {timeGroup.map((item, i) => (
            <div key={i}>
              <Select
                showSearch
                placeholder='请选择'
                style={{ width: 100, marginRight: 20 }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={(...arg) => this.handleChange(i, 'week', ...arg)}
                defaultValue={item.week}
                allowClear
              >
                {options.map((obj) => (
                  <Select.Option value={obj.value} key={obj.value}>
                    {obj.text}
                  </Select.Option>
                ))}
              </Select>
              <TimePicker
                value={item.startTime ? moment(item.startTime, 'HH:mm') : null}
                format='HH:mm:ss'
                onChange={(...arg) => this.handleChange(i, 'startTime', ...arg)}
              />{' '}
              —{' '}
              <TimePicker
                value={item.endTime ? moment(item.endTime, 'HH:mm') : null}
                format='HH:mm:ss'
                onChange={(...arg) => this.handleChange(i, 'endTime', ...arg)}
              />{' '}
              {timeGroup.length > 1 ? (
                <Button type='danger' shape='circle' icon='delete' size='small' onClick={() => this.delLine(i)} />
              ) : (
                ''
              )}
            </div>
          ))}
        </Col>
        <Col span={2}>
          {timeGroup.length < 7 ? (
            <Button type='primary' shape='circle' size='small' icon='plus' onClick={this.addLine} />
          ) : null}
        </Col>
      </Row>
    )
  }
}
