import React, { Component } from 'react'
import { Row, Col, Checkbox, Radio, Popover, Tag, Icon, Modal, Button, Input, message } from 'antd'
import styles from './style.module.css'
import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import { zywRange28 } from '@/utils/reg'

let cx = classNames.bind(styles)
/**
 * @description 年龄气泡弹窗内容
 * @param {object} props
 * @returns Component
 */
let GradePopContent = (props) => (
  <>
    <Row>
      <Checkbox
        indeterminate={props.value.length !== props.options.length}
        checked={props.value.length && props.value.length === props.options.length}
        onChange={({ target: { checked } }) => props.onCheckAll(checked, 'checkAll')}
      >
        全选
      </Checkbox>
    </Row>
    <Checkbox.Group onChange={(...args) => props.onChange(...args)} value={props.value}>
      <Row style={{ maxWidth: 500 }}>
        {props.options?.map((item, i) => (
          <Col span={8} className={cx('col')} key={i}>
            <Checkbox value={item.id}>{item.name}</Checkbox>
          </Col>
        ))}
      </Row>
    </Checkbox.Group>
  </>
)

/**
 * @description 科目气泡弹窗内容
 * @param {object} props
 * @returns Component
 */
let SubjectPopContent = (props) => (
  <Radio.Group onChange={({ target: { value } }) => props.onChange(value)} value={props.value}>
    <Row style={{ maxWidth: 500 }}>
      {props.options?.map((item, i) => (
        <Col span={8} className={cx('col')} key={i}>
          <Radio value={item.id}>{item.name}</Radio>
        </Col>
      ))}
    </Row>
  </Radio.Group>
)

/**
 * @description 科目、年龄选择组件
 * @param {object} props
 * @returns Component
 */
const PopoverSelection = (props) => {
  let { tags = [], text = '', type = 'right', content: ChildComponent, ..._props } = props
  return (
    <>
      {tags.map((tag) => (
        <Tag closable={true} onClose={() => props.onClose(tag.id)} key={tag.id} color='blue'>
          {tag.name}
        </Tag>
      ))}
      <Popover
        content={Array.isArray(_props.options) ? <ChildComponent {..._props} /> : _props.options || ''}
        trigger='click'
        placement='right'
      >
        <span className={cx('info-button')}>
          {text} <Icon type={type} />
        </span>
      </Popover>
    </>
  )
}

PopoverSelection.propTypes = {
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

PopoverSelection.defaultProps = {
  onClose: () => {},
  onChange: () => {},
}

class TagsSelection extends Component {
  state = {
    dialogVisible: false,
    tagOption: [],
  }

  handleClick = async () => {
    let r = await this.props.getLabelData()
    if (r.checked) this.setState({ dialogVisible: true, tagOption: r.data })
  }

  onCancel = () => {
    this.setState(() => ({
      tagOption: [],
      dialogVisible: false,
    }))
  }

  render() {
    let { cTags = [], onClose = () => {}, customTag } = this.props
    return (
      <>
        {customTag ? (
          <Tag closable={true} onClose={() => onClose(0, 'custom')} color='blue'>
            {customTag}
          </Tag>
        ) : (
          ''
        )}
        {cTags.map((tag) => (
          <Tag closable={true} onClose={() => onClose(tag.id)} key={tag.id} color='blue'>
            {tag.name}
          </Tag>
        ))}
        <span className={cx('info-button')} onClick={this.handleClick}>
          {this.props.title} <Icon type='down' />
        </span>
        {this.state.dialogVisible ? <TagDialog {...this.props} {...this.state} onCancel={this.onCancel} /> : ''}
        <span className={cx('tip-text')}>&nbsp;&nbsp;最多设置3个标签</span>
      </>
    )
  }
}

TagsSelection.propTypes = {
  getLabelData: PropTypes.func.isRequired,
}

class TagDialog extends Component {
  constructor(props) {
    super(props)
    let disabled = Boolean(props.customTag || (Array.isArray(props.cTags) && props.cTags.length >= 3))
    this.state = {
      visible: true,
      customTag: props.customTag,
      selectedTag: props.cTags || [],
      disabled,
      inputValue: undefined,
    }
  }

  handleAdd = () => {
    let customTag = this.state.inputValue?.trim()
    if (customTag && zywRange28.test(customTag)) {
      this.setState({ customTag, disabled: true, inputValue: undefined })
    } else {
      message.warning('请输入2-8个字符，支持中英文、数字')
    }
  }

  handleSelected = (obj) => {
    let { selectedTag, customTag } = this.state
    if ((selectedTag.length >= 2 && customTag) || selectedTag.length >= 3) {
      message.warning('最多设置3个标签')
    } else {
      if (selectedTag.some((item) => item.id === obj.id)) return
      selectedTag = [...selectedTag, obj]
      let disabled = Boolean(customTag || selectedTag.length >= 3)
      this.setState({ selectedTag, disabled })
    }
  }

  handleClose = (val, type) => {
    if (type === 'custom') {
      this.setState({
        customTag: '',
        disabled: false,
      })
    } else {
      let { selectedTag, customTag } = this.state
      for (let i in selectedTag) {
        if (selectedTag[i].id === val) {
          selectedTag.splice(i, 1)
          break
        }
      }
      let disabled = Boolean(customTag || selectedTag.length >= 3)
      this.setState({
        selectedTag,
        disabled,
      })
    }
  }
  handleOK = () => {
    let { selectedTag: cTags, customTag = '' } = this.state
    let list = []
    cTags.forEach((item) => list.push(item.id))
    this.props.onChange(list, { cTags, customTag })
    this.props.onCancel()
  }

  render() {
    let { visible, selectedTag, customTag, disabled, inputValue } = this.state
    return (
      <Modal
        visible={visible}
        width='60%'
        style={{ minWidth: 600 }}
        title={this.props.title}
        destroyOnClose={true}
        footer={
          <Button onClick={this.handleOK} type='primary'>
            确定
          </Button>
        }
        onCancel={this.props.onCancel}
      >
        <div className={cx('dialog-block')}>
          <div className={cx('dialog-top')}>
            已设置标签：
            {customTag ? (
              <Tag closable={true} onClose={() => this.handleClose(0, 'custom')} color='blue'>
                {customTag}
              </Tag>
            ) : null}
            {selectedTag.map((tag) => (
              <Tag closable={true} onClose={() => this.handleClose(tag.id)} key={tag.id} color='blue'>
                {tag.name}
              </Tag>
            ))}
          </div>
          <div className={cx('custom-block')}>
            自定义标签：
            <Input
              style={{ width: '15em', marginRight: '1em' }}
              placeholder='2-6个字符，限一个标签'
              value={inputValue}
              disabled={disabled}
              onChange={({ target: { value: inputValue } }) => this.setState({ inputValue })}
              allowClear
            />
            <Button type='info' disabled={disabled} onClick={this.handleAdd}>
              添加
            </Button>
          </div>
          <div className={cx('tag-content')}>
            {this.props.tagOption.map((item) => (
              <Button className={cx('btn-tag')} type='info' key={item.id} onClick={() => this.handleSelected(item)}>
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    )
  }
}

export { GradePopContent, SubjectPopContent, PopoverSelection, TagsSelection }
