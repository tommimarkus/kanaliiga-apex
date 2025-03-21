import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.scss'
import { BrowserRouter } from 'react-router-dom'

import axios from 'axios'
import { Settings } from 'luxon'

import App from './App'
import reportWebVitals from './reportWebVitals'

Settings.defaultLocale = 'en-GB'

const container = document.getElementById('root')
if (container != null) {
  const root = createRoot(container)
  root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
  )
  const basicAuth = typeof process.env.REACT_APP_BASIC_AUTH === 'string' ? process.env.REACT_APP_BASIC_AUTH : ''
  axios.defaults.headers.common.Authorization = `Basic ${basicAuth}`
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
