import { SAVE } from '../constants/action-types';
import { INITIATED, COMPLETED } from '../constants/status-types';
import { failed } from '../utils';

export default function save(comment) {
  return (dispatch, getState) => {
    const { locations, github, file: { text } } = getState();

    dispatch({ type: SAVE, status: INITIATED });

    github.write(locations.current, text, comment || 'Content-Editor changes')
      .then(completed(dispatch))
      .catch(failed(dispatch, SAVE));
  }
}

function completed(dispatch) {
  return () => dispatch({ type: SAVE, status: COMPLETED });
}