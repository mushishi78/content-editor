import { CREATE } from '../constants/action-types';

export default function create(path) {
	const text = `---
title:
date: ${new Date().toISOString().slice(0,10)}
---
`
  return { type: CREATE, path, file: { text } };
}