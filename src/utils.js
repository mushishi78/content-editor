import { FAILED } from './constants/status-types';

/* http://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings */
export function atob(str) {
	str = str.replace(/\s/g, '');
  return decodeURIComponent(escape(window.atob(str)));
}

export function failed(dispatch, constant) {
  return err => {
    let message = err.request && err.request.statusText || err.message;
    dispatch({ type: constant, status: FAILED, flash: message });
  };
}

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray */
export function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}
