import { LOAD, LOGOUT } from '../constants/action-types';

export default function list(state = null, { type, list }) {
	switch (type) {
    case LOAD:
      return list || null;
    case LOGOUT:
      return null;
    default:
      return state;
  }
}
