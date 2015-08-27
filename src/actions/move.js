import { MOVE } from '../constants/action-types';
import { IN_PROGRESS, COMPLETED } from '../constants/status-types';
import { failed } from '../utils';

export default function move(oldPath, newPath) {
  return (dispatch, getState) => {
    const { location, github } = getState();

    dispatch({ type: MOVE, status: IN_PROGRESS });

    github.move(location, oldPath, newPath)
      .then(completed(dispatch, location, oldPath, newPath))
      .catch(failed(dispatch, MOVE));
  }
}

function completed(dispatch, location, oldPath, newPath) {
  return () => dispatch({ type: MOVE, status: COMPLETED, location, oldPath, newPath });
}