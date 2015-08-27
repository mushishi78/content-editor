import { REMOVE } from '../constants/action-types';
import { IN_PROGRESS, COMPLETED } from '../constants/status-types';
import { failed } from '../utils';

export default function remove(path) {
  return (dispatch, getState) => {
    const { location, github } = getState();

    dispatch({ type: REMOVE, status: IN_PROGRESS });

    github.remove(location, path)
      .then(completed(dispatch, location, path))
      .catch(failed(dispatch, REMOVE));
  }
}

function completed(dispatch, location, path) {
  return () => dispatch({ type: REMOVE, status: COMPLETED, location, path });
}
