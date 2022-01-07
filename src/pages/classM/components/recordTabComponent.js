import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class RecordTabComponent extends Component {
  static propTypes = {
    prop: PropTypes,
  }

  static defaultProps = {}

  render() {
    return <div>签到记录</div>
  }
}
