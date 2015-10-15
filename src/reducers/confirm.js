import { CONFIRM } from '../constants/action-types';

export default function confirm(state = null, { type, actionType, path }) {
  switch (type) {
    case CONFIRM:
      return { type: actionType, path };
    default:
      return null;
  }
}
