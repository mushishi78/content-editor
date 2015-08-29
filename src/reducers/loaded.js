import { LOAD, LOGIN } from '../constants/action-types';
import { COMPLETED } from '../constants/status-types';

export default function loaded(state = {}, { type, status, href }) {
  switch (type) {
    case LOGIN: return { ...state, '/': status === COMPLETED };
    case LOAD: return { ...state, [href]: status === COMPLETED };
    default: return state;
  }
}
