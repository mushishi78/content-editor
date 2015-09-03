import { CREATE, SET_LOCATION } from '../constants/action-types';
import { OWNER, REPO, PATH } from '../constants/location-types';

export default function location(state = { href: '' }, { type, href, path }) {
  switch(type) {
    case SET_LOCATION:
      return split(href);
    case CREATE:
      return setPath(state, path);
    default:
      return state;
  }
}

function setPath(state, path) {
  const href = ['', state.owner, state.repo, state.branch, path].join('/');
  return { ...state, href, path };
}

function split(href) {
  const [_, owner, repo, branch, ...path] = href.split('/');
  const type = branch ? PATH : repo ? REPO : OWNER;
  return { href, type, owner, repo, branch, path: path.join('/') };
}
