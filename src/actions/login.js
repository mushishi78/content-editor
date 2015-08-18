import _GHPromiser from '../gh-promiser';
import { LOGIN } from '../constants/action-types';
import { INITIATED, COMPLETED, FAILED } from '../constants/status-types';
import _load from './load';
import failed from '../failed';

export default function login({ username, password } = {}, GHPromiser = _GHPromiser, load = _load, storage = localStorage) {
  return dispatch => {
    username = backup('username', username, storage);
    password = backup('password', password, storage);

    if(username && password) {
      dispatch({ type: LOGIN, status: INITIATED });
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

function parseRepo({ name, full_name, owner: { login } }) {
  return { label: full_name, location: { owner: login, repo: name }, type: 'repo' };
}