import { LOGIN, LOGOUT, SET_LOCATION, LOAD } from '../constants/action-types';

export default function locations(state = { current: '/' }, { type, location, repos, contents }) {
  switch (type) {
    case LOGIN: return { ...state, '/': repos };
    case LOGOUT: return { current: state.current };
    case SET_LOCATION: return { ...state, current: location };
    case LOAD: return contents ? { ...state, [state.current]: contents } : state;
    default: return state;
  }
}
