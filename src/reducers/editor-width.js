import { CHANGE_EDITOR_WIDTH } from '../constants/action-types';
import { INCREMENT, DECREMENT } from '../constants/directions';

export default function editorWidth(state = 95, { type, direction }) {
  switch (type) {
    case CHANGE_EDITOR_WIDTH:
      return direction === INCREMENT ?
        Math.min(state + 10, 95) :
        Math.max(state - 10, 45);
    default:
      return state;
  }
}
