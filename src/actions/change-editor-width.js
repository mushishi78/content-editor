import { CHANGE_EDITOR_WIDTH } from '../constants/action-types';

export default function changeEditorWidth(direction) {
  return { type: CHANGE_EDITOR_WIDTH, direction };
}
