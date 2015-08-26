import { PROMPT, CREATE } from '../constants/action-types';

export default function prompt(actionType, path) {
  return (dispatch, getState) => {
    if(actionType === CREATE) {
      path = createPath(getState().location.path);
    }
    dispatch({ type: PROMPT, actionType, path });
  }
}

function createPath(path) {
  return [path, date() + '-untitled.md'].filter(Boolean).join('/');
}

function date() {
  return new Date().toISOString().slice(0,10);
}