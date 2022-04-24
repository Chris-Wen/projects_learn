import { lazy } from 'react'

let routes = []
const staticRoutes = []

/**
 * 利用require.context 工程化方法去构建route，虽然不需要写路由，但是无法import拆分打包，都会打包进一个js里，方案弃用
 */
// const files = require.context('@/pages/', true, /\.js$/)
// // eslint-disable-next-line array-callback-return
// files.keys().map((key) => {
//   if (key.includes('/components/')) return false

//   const splitFileName = key.split('.')
//   const path = splitFileName[1]
//   const classObj = files(key).default

//   if (classObj) {
//     routes.push({
//       path,
//       key: path,
//       name: classObj?.RouterName || classObj.name,
//       component: lazy(() => import(`@/pages/${key.split('./')[1]}`)),
//     })
//   }
// })

routes = [
  {
    key: '/classM/index',
    name: '班级管理',
    path: '/classM/index',
    component: lazy(() => import(`@/pages/appletsM/index.js`)),
  },
  {
    key: '/courseM/index',
    name: '课程管理',
    path: '/courseM/index',
    component: lazy(() => import(`@/pages/courseM/index.js`)),
  },
  {
    key: '/appletsM/index',
    name: '小程序管理',
    path: '/appletsM/index',
    component: lazy(() => import(`@/pages/appletsM/index.js`)),
  },
  {
    key: '/locationM/index',
    name: '地图管理',
    path: '/locationM/index',
    component: lazy(() => import(`@/pages/locationM/index.js`)),
  },
  {
    key: '/operateM/index',
    name: '运营管理',
    path: '/operateM/index',
    component: lazy(() => import(`@/pages/operateM/index.js`)),
  },
]

routes = routes.concat(staticRoutes)
console.log(routes)

export default routes
