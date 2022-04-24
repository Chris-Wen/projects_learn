import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { addressLocation } from '@/apis/global'
import { debounce } from '@/utils/index'

class TxMap extends Component {
  static propTypes = {
    style: PropTypes.object, //样式
    handleAble: PropTypes.bool, //地图是否可操作
    value: PropTypes.array, //地理坐标
    address: PropTypes.string, //未进行地理推荐位置选择，无具体定位信息，则通过具体地址查找到定位
    city: PropTypes.string, //无具体定位信息时，定位需要到城市级别 -- 与address配合一起查询
    onChange: PropTypes.func,
  }

  static defaultProps = {
    style: { width: '100%', height: '100%' },
    handleAble: false, //地图是否可操作
    onChange: () => {},
  }

  constructor(props) {
    super(props)
    let coorArr = props.value?.length === 2 ? props.value : [30.156241, 120.203849]

    this.state = {
      map: null, //地图容器
      marker: null, //可编辑图层
      infoWin: null, //地图区域对象
      timer: null,
      // isDragListen: false, //是否已监听地图拖动事件
      // isZoomListen: false, //是否已监听地图缩放事件
      coorArr, //坐标  经纬度
      // address: '',
    }
  }

  mapRef = React.createRef()

  static getDerivedStateFromProps(props, state) {
    let newState = {}
    if (props.value?.length === 2 && props.value?.toString() !== state.coorArr?.toString()) {
      newState.coorArr = props.value
    }
    return newState
  }

  //地址定位解析, 未进行地理推荐位置选择，无具体定位信息，则通过具体地址查找到定位
  searchLocation = debounce(async () => {
    if (!this.props.address) return
    let r = await addressLocation(this.props.address.trim(), this.props.city)
    //reliability： 可信度参考：值范围 1 <低可信> - 10 <高可信> 该值>=7时，解析结果较为准确
    console.log(r, 'search')
    if (r && r.status === 0 && r.result && r.result.reliability >= 7) {
      let location = r.result.location
      try {
        let _coordArr = [location.lat, location.lng]
        this.props.onChange(_coordArr)
      } catch (error) {}
    }
  }, 1000)

  //地图初始化
  mapInit = () => {
    let { map, coorArr } = this.state
    if (!map) {
      let map = new window.qq.maps.Map(this.mapRef.current, {
        center: new window.qq.maps.LatLng(coorArr[0], coorArr[1]), // 设置地图中心点坐标
        zoom: 16, // 设置地图缩放级别
      })
      this.setState({ map })
      this.markMap(map)
    }
  }

  //标记地理位置并修改地图中心
  markMap = debounce((map) => {
    let { marker, coorArr, infoWin } = this.state
    let { handleAble: draggable } = this.props

    let position = new window.qq.maps.LatLng(coorArr[0], coorArr[1])
    map.panTo(position)
    if (!marker) {
      marker = new window.qq.maps.Marker({
        position,
        animation: window.qq.maps.MarkerAnimation.DROP,
        draggable,
        map,
      })
      this.setState({ marker })
    } else {
      marker.setPosition(position)
    }

    //提示拖动定位信息提示
    if (draggable && marker && position) {
      if (!infoWin) {
        infoWin = new window.qq.maps.InfoWindow({ map })
        infoWin.open()
        infoWin.setContent('请拖动蓝色气泡选择具体位置')

        this.setState({ infoWin })

        this.dragListenter(marker, infoWin)
        this.zoomListener(map, infoWin)
      }
      infoWin.setPosition(position)
    }
  }, 1000)

  //地图缩放监听函数
  zoomListener = (map, infoWin) => {
    // this.setState({ isDragListen: true })
    window.qq.maps.event.addListener(map, 'zoom_changed', () => {
      let zoomLevel = map.getZoom()
      if (zoomLevel < 14 && infoWin) {
        infoWin.setContent('地图缩放级别太小,拖动定位时,定位位置将偏差巨大')
      }
    })
  }

  //地图拖动监听函数
  dragListenter = (marker, infoWin) => {
    // this.setState({ isZoomListen: true })
    window.qq.maps.event.addListener(marker, 'mouseup', (event) => {
      let latLng = event.latLng
      console.log('拖动定位', latLng.getLat().toFixed(6), latLng.getLng().toFixed(6))
      this.props.onChange([latLng.getLat().toFixed(6), latLng.getLng().toFixed(6)])
      if (infoWin) {
        infoWin.setContent('请拖动蓝色气泡选择门店具体位置')
        infoWin.setPosition(latLng)
      }
    })
  }

  componentDidMount() {
    this.mapInit()
  }

  componentDidUpdate({ address }, { coorArr }) {
    if (coorArr.length === 2 && coorArr.toString !== this.state.coorArr.toString()) {
      this.markMap(this.state.map)
    } else if (address !== this.props.address && this.props.address) {
      this.searchLocation()
    }
  }

  componentWillUnmount() {
    if (this.state.timer) clearTimeout(this.state.timer)
    try {
      if (this.handleAble && this.map) {
        window.removeEvent = function () {
          window.qq.maps.event.removeListener(this.dragListenter)
          window.qq.maps.event.removeListener(this.zoomListener)
        }
      }
      if (this.map) this.map.destroyed()
    } catch (error) {}
  }
  render() {
    return <div style={this.props.style} ref={this.mapRef}></div>
  }
}

export default TxMap
