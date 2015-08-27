import { PROMPT, MOVE } from '../constants/action-types';

export default function movePrompt(href) {
  const [_, owner, repo, branch, ...path] = href.split('/');
  return { type: PROMPT, actionType: MOVE, path: path.join('/') };
}