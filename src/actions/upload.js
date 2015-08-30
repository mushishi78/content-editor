import { UPLOAD } from '../constants/action-types';
import { IN_PROGRESS, COMPLETED } from '../constants/status-types';
import { failed } from '../utils';

export default function upload(name, text, comment = 'Content-Editor changes') {
  return (dispatch, getState) => {
    const { location, github } = getState();
    const href = location.href + '/' + name;
    const path = location.path ? location.path + '/' + name : name;
    const newLocation = { ...location, href, path };

    dispatch({ type: UPLOAD, status: IN_PROGRESS });

    github.write(newLocation, text, comment)
      .then(completed(dispatch, newLocation))
      .catch(failed(dispatch, UPLOAD));
  }
}

function completed(dispatch, location) {
  return () => dispatch({ type: UPLOAD, status: COMPLETED, location });
}