import { LOGIN, LOGOUT } from '../constants/action-types';
import { COMPLETED } from '../constants/status-types';

export default function loggedIn(state = false, { type, status }) {
	switch (type) {
    case LOGIN: return status === COMPLETED;
    case LOGOUT: return false;
    default: return state;
  }
}
