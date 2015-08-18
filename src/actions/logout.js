import { LOGOUT } from '../constants/action-types';

export default function logout(storage = localStorage) {
  storage.removeItem('username');
  storage.removeItem('password');
  return { type: LOGOUT };
}
