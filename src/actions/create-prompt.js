import { PROMPT, CREATE } from '../constants/action-types';

export default function createPrompt() {
  return (dispatch, getState) => {
    dispatch({ type: PROMPT, actionType: CREATE, path: createPath(getState()) });
  }
}

function createPath({ location: { path }}) {
	return path ? path + '/' : '';
}