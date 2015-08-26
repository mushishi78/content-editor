import { LOGIN, LOGOUT, LOAD, SAVE } from '../constants/action-types';
import { COMPLETED } from '../constants/status-types';

export default function contents(state = {}, { type, status, location, repos, contents }) {
  switch (type) {
    case LOGIN: return { ...state, '/': repos };
    case LOGOUT: return {};
    case LOAD: return contents ? { ...state, [location.href]: contents } : state;
    case SAVE: return status === COMPLETED  ? uncacheParent(state, location) : state;
    default: return state;
  }
}

function uncacheParent(state, location) {
  const splitHref = location.href.split('/');
  const parent = splitHref.slice(0, splitHref.length - 1).join('/');
  return { ...state, [parent]: null };
}