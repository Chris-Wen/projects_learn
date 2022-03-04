import React, { Suspense, lazy } from 'react'
import { Skeleton } from 'antd'
import { Navigate, useRoutes } from 'react-router-dom'

const routes = [
    {
        path: '/',
        element: <Navigate replace to='/appletsM' />,
    },
    {
        path: '/appletsM',
        component: lazy(() => import('../pages/appletsM')),
        children: [],
    },
]

// 路由处理方式
const generateRouter = (routers: any) => {
    return routers.map((item: any) => {
        item.children && (item.children = generateRouter(item.children))
        item.component &&
            (item.element = (
                <Suspense fallback={<Skeleton />}>
                    <item.component />
                </Suspense>
            ))
        return item
    })
}

const Router = () => useRoutes(generateRouter(routes))
export default Router
