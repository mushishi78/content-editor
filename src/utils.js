import { FAILED } from './constants/status-types';

/* http://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings */
export function atob(str) {
	str = str.replace(/\s/g, '');
  return decodeURIComponent(escape(window.atob(str)));
}

export function failed(dispatch, constant) {
  return err => {
    const message = !err.request ? err.message :
                      err.request.statusText + ': ' + JSON.parse(err.request.response).message

    dispatch({ type: constant, status: FAILED, flash: message });
    console.log(message);
    console.log(err);
  };
}

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray */
export function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

/* http://stackoverflow.com/questions/17858174/set-cursor-to-specific-position-on-specific-line-in-a-textarea */
export function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}
