// import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import './assets/css/common.css'

import './assets/js/sidebar'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Authentication from './Authentication'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Authentication />
  // </React.StrictMode>,
)
