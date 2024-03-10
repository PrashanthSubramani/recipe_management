import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, useDispatch, useSelector, connect} from 'react-redux'
import {store}  from './store/store';
import App from './App'; 
import './index.css';
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') 
);