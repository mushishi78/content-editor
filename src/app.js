import '../css/normalize.css';
import '../css/octicons.css';
import '../css/loader.css';
import '../css/app.css';

import 'babel/polyfill';
import './polyfills';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import thunk from 'redux-thunk';

import * as reducers from './reducers/index';
import createRouter from './routes';
import App from './components/app';
import { login } from './actions/index';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);
createRouter(store);
store.dispatch(login());

React.render((
  <Provider store={store}>
    {() => <App />}
  </Provider>
), document.body);
