
import { lazy } from 'react'



const routes: any[] = [
    {
      path: '/appletsM/index',
      element: lazy(() => import(`../pages/appletsM`)),
    }
]

export default routes