import { Form } from 'antd'
import TxMap from '@/components/TxMap'
import Image from '@/components/Image'
import { WEEKOPTIONS } from '@/utils/global'

//课程详情
const LocationDetail = (props) => {
  let trasformWeek = (val) => {
    for (const i in WEEKOPTIONS) {
      if (Object.hasOwnProperty.call(WEEKOPTIONS, i)) {
        const element = WEEKOPTIONS[i]
        if (element.value === val) return element.text
      }
    }
    return ''
  }

  let formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  }
  const tailFormItemLayout = {
    wrapperCol: { span: 16, offset: 4 },
  }
  let { dataSource: p } = props

  return (
    <Form {...formLayout}>
      <Form.Item label='学习场所名称：'>{p?.name}</Form.Item>
      <Form.Item label='场所简介：'>{p?.introduction}</Form.Item>
      <Form.Item label='上课排期'>
        {p?.openTimeList?.map((item, i) => (
          <div key={i}>
            每{trasformWeek(item?.week)} &nbsp;&nbsp;{item?.startTime} ~ {item?.endTime}
          </div>
        ))}
      </Form.Item>
      <Form.Item label='联系方式：'>{p?.mobile}</Form.Item>
      <Form.Item label='场所地址详情：'>{p?.address}</Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <TxMap handleAble={false} value={[p?.latitude, p?.longitude]} style={{ width: '90%', height: '60vh' }} />,
      </Form.Item>

      <Form.Item label='场所封面：'>
        <Image src={p?.coverUrl} style={{ width: 100 }} />
      </Form.Item>
      <Form.Item label='场所介绍图：'>
        {p?.introductionUrlList?.map((url, i) => (
          <Image key={i} style={{ width: 100, marginRight: '1em' }} src={url} />
        ))}
      </Form.Item>
    </Form>
  )
}

export default LocationDetail
