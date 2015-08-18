import { SET_LOCATION } from '../constants/action-types';
import _load from './load';

export default function setLocation(location, load = _load) {
  return (dispatch, getState) => {
    const previous = getState().location;
    location = fillMising(previous, location);

    if(changed(previous, location)) {
      dispatch({ type: SET_LOCATION, ...location });

      if(getState().loggedIn) { dispatch(load()); }
    }
  }
}

const order = ['owner', 'repo', 'branch', 'path', 'verb'];

function fillMising(previous, next, started = false, location = {}) {
  for(let i = order.length; i >= 0; i--) {
    started = started || next[order[i]];
    if(started) { location[order[i]] = next[order[i]] || previous[order[i]]; }
  }
  return location;
}

function changed(a, b, changed = false) {
  for(var key in a) { changed = changed || a[key] !== b[key]; }
  for(var key in b) { changed = changed || a[key] !== b[key]; }
  return changed;
}
