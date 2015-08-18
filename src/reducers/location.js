import { SET_LOCATION } from '../constants/action-types';

export default function location(state = {}, { type, owner, repo, branch, path, verb }) {
	switch (type) {
    case SET_LOCATION:
      return { owner, repo, branch, path, verb };
    default:
      return state;
  }
}
