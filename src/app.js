import '../css/normalize.css';
import '../css/octicons.css';
import '../css/loader.css';
import '../css/app.css';

import 'babel/polyfill';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import thunk from 'redux-thunk';
import ReactiveRouter from 'reactive-router';

import * as reducers from './reducers/index';
import App from './components/app';
import { login, setLocation } from './actions/index';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

const router = ReactiveRouter({ '*': ({ path }) => store.dispatch(setLocation(path)) });
store.subscribe(() => {
	const href = store.getState().location.href;
  document.title = 'Content Editor ' + href;
  router.setSilent(href);
});

store.dispatch(login());

React.render((
  <Provider store={store}>
    {() => <App />}
  </Provider>
), document.body);
