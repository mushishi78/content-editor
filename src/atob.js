/* http://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings */

export function atob(str) {
	str = str.replace(/\s/g, '');
  return decodeURIComponent(escape(window.atob(str)));
}