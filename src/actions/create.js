import { CREATE } from '../constants/action-types';

export default function create(path) {
  return { type: CREATE, path, file: { text: '' } };
}