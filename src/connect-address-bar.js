import addressbar from 'addressbar';
import { setLocation } from './actions/index';

export default function connectAddressBar(store) {
  setLocationToAddress(store, addressbar.value);
  addressbar.addEventListener('change', onAddressChange(store));
  store.subscribe(onLocationChange(store));
}

function setLocationToAddress(store, value) {
  store.dispatch(setLocation(value.replace(location.origin, '')));
}

function onAddressChange(store) {
  return event => {
    event.preventDefault();
    setLocationToAddress(store, event.target.value);
  }
}

function onLocationChange(store) {
  return () => {
    const href = store.getState().location.href;
    document.title = 'Content Editor ' + href;
    addressbar.value = location.origin + href;
  }
}