import { IN_PROGRESS, COMPLETED, FAILED } from '../constants/status-types';

export default function status(state = {}, { status, flash }) {
	switch (status) {
    case IN_PROGRESS:
    case COMPLETED:
    case FAILED:
      return { type: status, flash };
    default:
      return state;
  }
}
