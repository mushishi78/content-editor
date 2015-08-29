import { LOGIN, LOAD, SAVE, MOVE, REMOVE } from '../constants/action-types';
import { COMPLETED } from '../constants/status-types';

export default function contents(state = {}, action) {
  const { type, status, location, repos, contents, path } = action;

  switch (type) {
    case LOGIN: return repos ? mergeRepos(state, repos) : state;
    case LOAD: return contents ? merge(state, contents) : state;
    case SAVE: return location ? add(state, location.href) : state;
    case MOVE: return location ? move(state, action) : state;
    case REMOVE: return location ? remove(state, absolute(location, path)) : state;
    default: return state;
  }
}

function merge(_state, contents) {
  return contents.reduce((state, item) => add(state, item.href, item.type), _state);
}

function add(state, href, type = 'file') {
  state = { ...state };

  href.split('/').forEach((section, i, array) => {
    if(section) {
      let subHref = array.slice(0, i + 1).join('/');
      state[subHref] = ['owner', 'repo', 'branch'][i - 1] || 'dir';
    }
  });

  return { ...state, [href]: type };
}

function remove(state, href) {
  state = { ...state };
  delete state[href];
  return state;
}

function move(state, { location, oldPath, newPath }) {
  state = remove(state, absolute(location, oldPath));
  state = add(state, absolute(location, newPath));
  return state;
}

function absolute({ owner, repo, branch }, path) {
  return ['', owner, repo, branch, path].join('/');
}

function mergeRepos(state, repos) {
  return merge(state, repos.map(repo => ({ href: repo, type: 'repo' })));
}