import { SET_LOCATION } from '../constants/action-types';
import _load from './load';

export default function setLocation(href, load = _load) {
  return (dispatch, getState) => {
  	href = normalize(href);

    if(href !== getState().location.href) {
      dispatch({ type: SET_LOCATION, href });

      if(getState().loggedIn) { dispatch(load()); }
    }
  }
}

function normalize(href) {
  return href.split(/\/$/)[0] || '/';
}
