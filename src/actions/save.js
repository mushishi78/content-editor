import { SAVE } from '../constants/action-types';
import { INITIATED, COMPLETED } from '../constants/status-types';
import failed from '../failed';

export default function save(comment) {
  return (dispatch, getState) => {
    const { location, github, file: { content } } = getState();
    dispatch({ type: SAVE, status: INITIATED });
    github.write(location, content, comment || 'Content-Editor changes')
      .then(completed(dispatch))
      .catch(failed(dispatch, SAVE));
  }
}

function completed(dispatch) {
  return () => {
  	dispatch({ type: SAVE, status: COMPLETED, flash: 'Saved!' });
  }
}