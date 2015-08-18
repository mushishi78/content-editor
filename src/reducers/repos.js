import { LOGIN, LOGOUT } from '../constants/action-types';

export default function repos(state = null, { type, repos }) {
	switch (type) {
    case LOGIN:
      return repos || null;
    default:
      return state;
  }
}
