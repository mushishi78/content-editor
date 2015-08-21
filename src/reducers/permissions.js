import { LOGIN, LOGOUT, SET_LOCATION } from '../constants/action-types';

export default function permissions(state = { repos: [] }, { type, location, repos = [] }) {
  switch (type) {
    case LOGIN:
      let repos = repos.map(repo => repo.location);
      return { ...state, repos, write: write(repos, state.repo) };

    case LOGOUT:
      return { repo: state.repo, write: false };

    case SET_LOCATION:
      let repo = location.split('/').slice(0, 3).join('/');
      return { ...state, repo, write: write(state.repos, repo) };

    default:
      return state;
  }
}

function write(repos, repo) {
  return repos.indexOf(repo) >= 0;
}