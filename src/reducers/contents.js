import { LOGIN, LOGOUT, LOAD, SAVE, MOVE, REMOVE } from '../constants/action-types';
import { COMPLETED } from '../constants/status-types';

export default function contents(state = {}, action) {
  const { type, status, location, repos, contents, oldPath, newPath, path } = action;

  switch (type) {
    case LOGIN: return { ...state, '/': repos };
    case LOGOUT: return {};
    case LOAD: return contents ? { ...state, [location.href]: contents } : state;
    case SAVE: return status === COMPLETED  ? uncacheParent(state, location) : state;
    case MOVE:
    case REMOVE:
    default: return state;
  }
}

function uncacheParent(state, location) {
  const splitHref = location.href.split('/');
  const parent = splitHref.slice(0, splitHref.length - 1).join('/');
  return { ...state, [parent]: null };
}