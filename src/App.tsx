import React,  {Suspense } from "react";
import routes from './routes'
import { Skeleton } from 'antd'
import { HashRouter, Routes, Route,  Navigate } from 'react-router-dom'
import "./App.css";


const App = () =>(
   <HashRouter>
    <Suspense fallback={<Skeleton />}>
      <Routes>
        {routes.map((router) => (
          <Route exact {...router} key={router.path} />
        ))}
        <Route path="/" element={<Navigate replace to="/appletsM/index" />} />
      </Routes>
    </Suspense>
  </HashRouter>
) 

  


export default App;
