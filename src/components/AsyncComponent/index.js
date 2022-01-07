import PropTypes from 'prop-types'
import { Suspense, lazy } from 'react'

// const View = lazy(() => import('@/pages/appletsM/index.js'))

/**
 * @description 异步组件
 * @param {String} path 文件路径
 * @param {Object} _props
 */
let AsyncComponent = (props = {}) => {
  let { path, ..._props } = props
  const View = lazy(() => import(`@/${path}`))

  return (
    <Suspense fallback={null}>
      <View {..._props} />
    </Suspense>
  )
}

AsyncComponent.propTypes = {
  path: PropTypes.string.isRequired,
}

export default AsyncComponent
