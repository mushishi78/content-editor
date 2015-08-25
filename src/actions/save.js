import { SAVE } from '../constants/action-types';
import { IN_PROGRESS, COMPLETED } from '../constants/status-types';
import { failed } from '../utils';

export default function save(comment) {
  return (dispatch, getState) => {
    const { locations, github, file: { text } } = getState();

    dispatch({ type: SAVE, status: IN_PROGRESS });

    github.write(locations.current, text, comment || 'Content-Editor changes')
      .then(completed(dispatch))
      .catch(failed(dispatch, SAVE));
  }
}

function completed(dispatch) {
  return () => dispatch({ type: SAVE, status: COMPLETED });
}