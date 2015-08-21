import { SET_LOCATION } from '../constants/action-types';
import _load from './load';

export default function setLocation(location, load = _load) {
  return (dispatch, getState) => {

    if(location !== getState().locations.current) {
      dispatch({ type: SET_LOCATION, location });

      if(getState().loggedIn) { dispatch(load()); }
    }
  }
}