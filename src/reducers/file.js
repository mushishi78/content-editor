import { CREATE, LOAD, SET_TEXT, SAVE, SET_LOCATION, LOGOUT } from '../constants/action-types';
import { COMPLETED } from '../constants/status-types';

export default function file(state = null, { type, file, text, status }) {
  switch (type) {
    case CREATE: return tainted(file);
    case LOAD: return file ? untainted(file) : null;
    case SET_TEXT: return changed(state, text);
    case SAVE: return status === COMPLETED ? untainted(state) : state;
    case SET_LOCATION:
    case LOGOUT: return null;
    default: return state;
  }
}

function tainted(file) {
  return { ...file, original: null, changed: true };
}

function untainted(file) {
  return { ...file, original: file.text, changed: false };
}

function changed(state, text) {
  return { ...state, text, changed: text !== state.original }
}
