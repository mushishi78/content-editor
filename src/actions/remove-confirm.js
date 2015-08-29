import { CONFIRM, REMOVE } from '../constants/action-types';

export default function removeConfirm(href) {
  const [_, owner, repo, branch, ...path] = href.split('/');
  return { type: CONFIRM, actionType: REMOVE, path: path.join('/') };
}