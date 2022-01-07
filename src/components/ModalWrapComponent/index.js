import React, { Component } from 'react'
import { Modal } from 'antd'
import AsyncComponent from '../AsyncComponent/index'

export default class ModalWrapComponent extends Component {
  state = {
    visible: false,
    props: {},
    config: {
      path: '',
    },
  }

  initModal = (config = {}, props = {}) => {
    if (!config.path) {
      throw new Error('组件文件路径必传')
    }
    this.setState(() => ({
      visible: true,
      props,
      config,
    }))
  }

  hideModal = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { state: t } = this
    return (
      <Modal visible={t.visible} {...t.config} footer={null} onCancel={this.hideModal}>
        <AsyncComponent path={t.config.path} {...t.props} hideModal={this.hideModal} />
      </Modal>
    )
  }
}
