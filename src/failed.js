import { FAILED } from './constants/status-types';

export default function failed(dispatch, constant) {
  return err => {
    let message = err.request && err.request.statusText || err.message;
    dispatch({ type: constant, status: FAILED, flash: message });
  };
}
