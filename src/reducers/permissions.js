import { LOGIN, LOGOUT, SET_LOCATION } from '../constants/action-types';

export default function permissions(state = { repos: [] }, { type, href, repos = [] }) {
  switch (type) {
    case LOGIN:
      const repos = repos.map(repo => repo.href);
      return { ...state, repos, write: write(repos, state.repo) };

    case LOGOUT:
      return { repo: state.repo, write: false };

    case SET_LOCATION:
      const repo = href.split('/').slice(0, 3).join('/');
      return { ...state, repo, write: write(state.repos, repo) };

    default:
      return state;
  }
}

function write(repos, repo) {
  return repos.indexOf(repo) >= 0;
}