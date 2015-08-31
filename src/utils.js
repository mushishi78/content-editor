import { FAILED } from './constants/status-types';

export function alphabetical(a, b) {
  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();
  if(lowerA < lowerB) return -1;
  if(lowerA > lowerB) return 1;
  return 0
}

/* http://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings */
export function atob(str) {
	str = str.replace(/\s/g, '');
  try {
    str = decodeURIComponent(escape(window.atob(str)));
  } finally {
    return str;
  }
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
export function setSelection(input, selectionStart, selectionEnd) {
  selectionEnd = selectionEnd || selectionStart;

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