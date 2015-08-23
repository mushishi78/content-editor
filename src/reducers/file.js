import { LOAD, SET_TEXT, SAVE, SET_LOCATION, LOGOUT } from '../constants/action-types';
import { COMPLETED } from '../constants/status-types';

export default function file(state = null, { type, file, text, status }) {
	switch (type) {
    case LOAD: return file ? fresh(file) : null;
    case SET_TEXT: return { ...state, text, changed: text !== state.original };
    case SAVE: return status === COMPLETED ? fresh(state) : state;
    case SET_LOCATION:
    case LOGOUT: return null;
    default: return state;
  }
}

function fresh(file) {
	return { ...file, original: file.text, changed: false };
}
