import { SET_LOCATION } from '../constants/action-types';
import _load from './load';

export default function setLocation(href, load = _load, origin = location.origin) {
  return (dispatch, getState) => {
    href = normalize(href, origin);

    if(href !== getState().location.href) {
      dispatch({ type: SET_LOCATION, href });

      if(getState().loggedIn) { dispatch(load()); }
    }
  }
}

function normalize(href, origin) {
  href = href.replace(origin, '');
  href = decodeURIComponent(href);
  href = href.replace(/\/$/, '') || '/';
  return href;
}
