import _GHPromiser from '../gh-promiser';
import { LOGIN } from '../constants/action-types';
import { IN_PROGRESS, COMPLETED, FAILED } from '../constants/status-types';
import _load from './load';
import { failed } from '../utils';

export default function login({ accessToken } = {}, GHPromiser = _GHPromiser, load = _load, storage = localStorage) {
  return dispatch => {
    accessToken = backup('accessToken', accessToken, storage);

    if(accessToken) {
      dispatch({ type: LOGIN, status: IN_PROGRESS });

      const github = GHPromiser(accessToken);
      github.repos().then(completed(dispatch, github, load)).catch(failed(dispatch, LOGIN));
    }
  }
}

function backup(key, value, storage) {
  if(storage) {
    value = value || storage.getItem(key);

    if(value) {
      storage.setItem(key, value);
    } else {
      storage.removeItem(key);
    }
  }
  return value;
}

function completed(dispatch, github, load) {
  return (repos) => {
    dispatch({ type: LOGIN, status: COMPLETED, github, repos: repos.map(parseRepo) });
    dispatch(load());
  };
}

function parseRepo(repo) {
  return '/' + repo.full_name;
}