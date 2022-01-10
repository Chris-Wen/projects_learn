import { lazy } from 'react'

let routes = []
const staticRoutes = []

const files = require.context('@/pages/', true, /\.js$/)
// eslint-disable-next-line array-callback-return
files.keys().map((key) => {
  if (key.includes('/components/')) return false

  const splitFileName = key.split('.')
  const path = splitFileName[1]
  const classObj = files(key).default

  if (classObj) {
    routes.push({
      path,
      key: path,
      name: classObj?.RouterName || classObj.name,
      component: lazy(() => import(`@/pages/${key.split('./')[1]}`)),
    })
  }
})

routes = routes.concat(staticRoutes)
console.log(routes)
export default routes
