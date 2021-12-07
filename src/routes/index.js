import { lazy } from 'react'

const routes = [
  {
    path: '/mpManage',
    name: '小程序管理',
    key: 'mpManage',
    component: lazy(() => import('@/pages/mpM/index.js')),
  },
  {
    path: '/classManage',
    name: '班级管理',
    key: 'classManage',
    component: lazy(() => import('@/pages/classM/index.js')),
  },
]

export default routes
