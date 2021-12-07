import React, { Suspense } from 'react'
import routes from './routes'
import { Skeleton } from 'antd'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<Skeleton />}>
        <Switch>
          {routes.map((router) => (
            <Route exact {...router} />
          ))}
          <Redirect exact from='/' to='/mpManage' />
        </Switch>
      </Suspense>
    </HashRouter>
  )
}

export default App
