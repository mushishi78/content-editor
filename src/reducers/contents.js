import { LOGIN, LOGOUT, LOAD } from '../constants/action-types';

export default function contents(state = {}, { type, location, repos, contents }) {
  switch (type) {
    case LOGIN: return { ...state, '/': repos };
    case LOGOUT: return {};
    case LOAD: return location && contents ? { ...state, [location.href]: contents } : state;
    default: return state;
  }
}
