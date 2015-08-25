import { SET_LOCATION } from '../constants/action-types';
import { OWNER, REPO, PATH } from '../constants/location-types';

export default function location(state = {}, { type, href }) {
  return type === SET_LOCATION ? split(href) : state;
}

function split(href) {
  const [_, owner, repo, branch, ...path] = href.split('/');
  const type = branch ? PATH : repo ? REPO : OWNER;
  return { href, type, owner, repo, branch, path: path.join('/') };
}
