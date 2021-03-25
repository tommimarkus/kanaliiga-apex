import { StrictMode } from 'react';
import { render } from 'react-dom';

import './index.scss';
import axios from 'axios';

import App from './App';
import reportWebVitals from './reportWebVitals';

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);

axios.defaults.headers.common.Authorization = `Basic ${process.env.REACT_APP_BASIC_AUTH}`;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
