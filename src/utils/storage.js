import umbrella from 'umbrella-storage'

// 配置自定义前缀   文档：https://cnpmjs.org/package/umbrella-storage
let prefix = 'wasuEdu_'
umbrella.config(prefix)

let db = {
  get: (key, defaultValue = {}) => umbrella.getLocalStorage(key) || umbrella.getSessionStorage(key) || defaultValue,
  save(key, value, isSession = false) {
    isSession ? umbrella.setSessionStorage(key, value) : umbrella.setLocalStorage(key, value)
  },
  remove(key) {
    umbrella.removeLocalStorage(key)
    umbrella.removeSessionStorage(key)
  },
}

export default db
