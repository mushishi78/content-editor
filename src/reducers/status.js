import { INITIATED, COMPLETED, FAILED } from '../constants/status-types';

export default function status(state = {}, { status, flash }) {
	switch (status) {
    case INITIATED:
    case COMPLETED:
    case FAILED:
      return { type: status, flash };
    default:
      return state;
  }
}
