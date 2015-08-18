import { LOAD, SET_CONTENT, LOGOUT } from '../constants/action-types';

export default function file(state = null, { type, file, content }) {
	switch (type) {
    case LOAD:
      return file || null;
    case SET_CONTENT:
      return { ...state, content }
    case LOGOUT:
      return null;
    default:
      return state;
  }
}

