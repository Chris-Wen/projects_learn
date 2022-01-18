import { Form } from 'antd'
import styles from '../newCourse/style.module.css'
import classNames from 'classnames/bind'
import Image from '@/components/Image'

let cx = classNames.bind(styles)

//课程详情
const CourseDetail = (props) => {
  let formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  }
  return (
    <Form {...formLayout}>
      <div className={cx('sub-title')}>基础信息</div>
      <Form.Item label='课程名称'>{props?.courseName}</Form.Item>
      <Form.Item label='优势亮点'>{props?.courseSubtitle}</Form.Item>
      <Form.Item label='所属科目'>{props?.subjectName}</Form.Item>
      <Form.Item label='适合年龄'>
        {props?.courseAgeList?.map((item) => (
          <span key={item.id} className={cx('space-padding')}>
            {item.name}
          </span>
        ))}
      </Form.Item>
      <Form.Item label='课程标签'>
        {props?.courseCustomizeLabel ? <span className={cx('space-padding')}>{props?.courseCustomizeLabel}</span> : ''}
        {props?.courseLabelList?.map((item) => (
          <span key={item.id} className={cx('space-padding')}>
            {item.name}
          </span>
        ))}
      </Form.Item>
      <Form.Item label='课程头图'>
        <Image className={cx('image')} src={props?.courseLogo} />
      </Form.Item>
      <Form.Item label='课程头图'>
        {props?.courseFirstPicture?.map((url, i) => (
          <Image className={cx('image')} src={url} key={i} />
        ))}
      </Form.Item>
      <Form.Item label='课程介绍图'>
        {props?.coursePicture?.map((url, i) => (
          <Image className={cx('image')} src={url} key={i} />
        ))}
      </Form.Item>
      <Form.Item label='课程简介'>
        <div dangerouslySetInnerHTML={{ __html: props?.courseBriefIntroduction }}></div>
      </Form.Item>
      <div className={cx('sub-title')}>售卖信息</div>
      <Form.Item label='课程类型'>{props?.courseTypeName}</Form.Item>
      <Form.Item label='课时数'>{props?.courseNodes}节</Form.Item>
      <Form.Item label='不使用积分价格'>{props?.priceWithoutScore} 元</Form.Item>
      <Form.Item label='使用积分现金价格'>{props?.priceWithCash} 元</Form.Item>
      <Form.Item label='使用积分数'>
        {props?.priceWithScore}
        积分
      </Form.Item>
    </Form>
  )
}

export default CourseDetail
