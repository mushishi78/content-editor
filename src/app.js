import '../css/normalize.css';
import '../css/octicons.css';
import '../css/loader.css';
import '../css/animations.css';
import '../css/app.css';

import 'babel/polyfill';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import thunk from 'redux-thunk';

import * as reducers from './reducers/index';
import App from './components/app';
import { login } from './actions/index';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

store.dispatch(login());

React.render((
  <Provider store={store}>
    {() => <App />}
  </Provider>
), document.body);
