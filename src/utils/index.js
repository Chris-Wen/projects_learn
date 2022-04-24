//常用公共函数

/**
 *
 * @description 图片base64
 * @param {Blob | File} file
 * @returns
 */
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

/**
 *
 * @description 防抖
 * @param {function} fn
 * @param {number} [delay=200]
 * @returns
 */
export function debounce(fn, delay = 200) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      clearTimeout(timer)
      timer = null
    }, delay)
  }
}

/**
 *
 * @description 节流
 * @param {function} fn
 * @param {number} [delay=200]
 * @returns
 */
export function throttle(fn, delay = 200) {
  let flag = true
  return function (...args) {
    if (!flag) return
    flag = false
    let timer = setTimeout(() => {
      fn.apply(this, args)
      flag = true
      clearTimeout(timer)
    }, delay)
  }
}
