import axios from 'axios'
import { getToken } from './global'

const timeout = 10 * 1000 // 请求超时时间，10s
const messageDuration = 5 * 1000 // 提示信息显示时长

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
  withCredentials: true,
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
        _config.headers['Authorization'] = getToken()
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
    if (config.status === 200 && config.data.status === 403) {
    }
    return config
  },
  (error) => {
    if (error.response) {
      // const errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
      switch (error.response.status) {
        case 404:
          break
        case 403:
          break
        case 401:
          break
        default:
          break
      }
    }
    return Promise.reject(error)
  },
)

export default service
