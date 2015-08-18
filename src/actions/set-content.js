import { SET_CONTENT } from '../constants/action-types';

export default function setContent(content) {
  return { type: SET_CONTENT, content };
}
