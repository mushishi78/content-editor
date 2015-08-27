import { PROMPT, CREATE } from '../constants/action-types';

export default function createPrompt() {
  return (dispatch, getState) => {
    const path = createPath(getState().location.path);
    dispatch({ type: PROMPT, actionType: CREATE, path });
  }
}

function createPath(path) {
  return [path, date() + '-untitled.md'].filter(Boolean).join('/');
}

function date() {
  return new Date().toISOString().slice(0,10);
}