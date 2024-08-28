import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // 導入 Service Worker 註冊

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// 註冊 Service Worker
serviceWorkerRegistration.register(); // 調用 register 方法來註冊 Service Worker
