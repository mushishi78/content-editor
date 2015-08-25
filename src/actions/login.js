import _GHPromiser from '../gh-promiser';
import { LOGIN } from '../constants/action-types';
import { IN_PROGRESS, COMPLETED, FAILED } from '../constants/status-types';
import _load from './load';
import { failed } from '../utils';

export default function login({ username, password } = {}, GHPromiser = _GHPromiser, load = _load, storage = localStorage) {
  return dispatch => {
    username = backup('username', username, storage);
    password = backup('password', password, storage);

    if(username && password) {
      dispatch({ type: LOGIN, status: IN_PROGRESS });

      const github = GHPromiser(username, password);
      github.repos().then(completed(dispatch, github, load)).catch(failed(dispatch, LOGIN));
    }
  }
}

function backup(key, value, storage) {
  if(storage) {
    value = value || storage.getItem(key);
    storage.setItem(key, value);
  }
  return value;
}

function completed(dispatch, github, load) {
  return (repos) => {
    dispatch({ type: LOGIN, status: COMPLETED, github, repos: repos.map(parseRepo) });
    dispatch(load());
  };
}

function parseRepo({ full_name }) {
  return { label: full_name, location: '/' + full_name, type: 'repo' };
}