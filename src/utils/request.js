import axios from 'axios'
import { getToken } from './global'
import { message } from 'antd'

const timeout = 10 * 1000 // 请求超时时间，10s
const messageDuration = 5 // 提示信息显示时长

let requestPool = [] //每个ajax请求的取消函数和ajax标识
const service = axios.create({
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout,
  responseType: 'json',
  // `validateStatus` 定义了对于给定的 HTTP状态码是 resolve 还是 reject promise。
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，
  // 则promise 将会 resolved，否则是 rejected。
  validateStatus: function (status) {
    return status === 200
  },
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // 添加取消标记
    config.cancelToken = new axios.CancelToken((cancel) => {
      requestPool.push({ id: `${config.url}&${config.method}`, cancel })
    })
    let _config = config
    try {
      if (getToken()) {
        _config.headers['token'] = getToken()
      }
    } catch (e) {
      console.error(e)
    }
    return _config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  (config) => {
    //移除request 取消函数标识
    requestPool.forEach((r, i) => {
      //同一个请求，取消请求并移除
      if (r.id === `${config.url}&${config.method}`) {
        r.cancel()
        requestPool.splice(i, 1)
      }
    })

    //操作异常、接口异常状态统一弹窗
    if (config.status === 200 && config.data.code !== 200) {
      message.error({
        duration: messageDuration,
        content: config.data.message || '系统开小差了，请稍后重试!!!',
      })
    }
    return config.data
  },
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data ? '系统内部异常，请联系网站管理员' : error.response.data.message
      switch (error.response.status) {
        case 403:
          message.error({
            duration: messageDuration,
            content: '很抱歉，您暂无该操作权限',
          })
          break
        default:
          message.error({
            duration: messageDuration,
            content: errorMessage,
          })
          break
      }
    }
    return Promise.reject(error)
  },
)

const request = {
  post(url, params, type) {
    return service.post(url, params, {
      headers: {
        'Content-Type': type || 'application/x-www-form-urlencoded',
      },
    })
  },
  put(url, params) {
    return service.put(url, params, {
      transformRequest: [
        (params) => {
          return tansParams(params)
        },
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },
  get(url, params, type) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.get(`${url}${_params}`)
  },
  delete(url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.delete(`${url}${_params}`)
  },
}

function tansParams(params) {
  let result = ''
  Object.keys(params).forEach((key) => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result
}

export default request
