import { Modal } from 'antd'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Image extends Component {
  state = {
    attr: {
      src: this.props.src || '#',
      style: this.props.style || {},
      className: this.props.className || '',
    },
    visible: false,
  }

  handleModalStat = () => {
    this.setState(({ visible }) => {
      return {
        visible: !visible,
      }
    })
  }

  // getDerivedStateFromProps = () => {}

  render() {
    const { state: t } = this
    return (
      <>
        <img {...t.attr} alt='' onClick={this.handleModalStat} />
        <Modal width='60%' visible={t.visible} footer={null} onCancel={this.handleModalStat} centered>
          <img style={{ width: '100%' }} src={t.attr.src} alt='previewImg' />
        </Modal>
      </>
    )
  }
}

Image.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
}
