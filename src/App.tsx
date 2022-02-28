import React from "react";
import Router from './routes'
import { HashRouter } from 'react-router-dom'
import './App.css';

const App = () => (
   <HashRouter>
      <Router />
  </HashRouter>
)

export default App;
