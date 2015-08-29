import { SAVE } from '../constants/action-types';
import { IN_PROGRESS, COMPLETED } from '../constants/status-types';
import { failed } from '../utils';

export default function save() {
  return (dispatch, getState) => {
    const { location, github, file: { text } } = getState();

    dispatch({ type: SAVE, status: IN_PROGRESS });

    github.write(location, text, 'Content-Editor changes')
      .then(completed(dispatch, location))
      .catch(failed(dispatch, SAVE));
  }
}

function completed(dispatch, location) {
  return () => dispatch({ type: SAVE, status: COMPLETED, location });
}