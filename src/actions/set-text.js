import { SET_TEXT } from '../constants/action-types';

export default function setText(text) {
  return { type: SET_TEXT, text };
}
