import { PROMPT } from '../constants/action-types';

export default function prompt(state = null, { type, actionType, path }) {
	switch (type) {
    case PROMPT:
      return { type: actionType, path };
    default:
      return null;
  }
}
