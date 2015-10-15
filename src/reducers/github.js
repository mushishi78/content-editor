import { LOGIN, LOGOUT } from '../constants/action-types';

export default function github(state = null, { type, github }) {
  switch (type) {
    case LOGIN: return github || null;
    default: return state;
  }
}
