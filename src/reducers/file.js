import { LOAD, SET_TEXT, SET_LOCATION } from '../constants/action-types';

export default function file(state = null, { type, file, text }) {
	switch (type) {
    case LOAD: return file || null;
    case SET_TEXT: return { ...state, text };
    case SET_LOCATION: return null;
    default: return state;
  }
}
