import _ReactiveRouter from 'reactive-router';
import * as actions from './actions/index';

export default function createRouter(store, ReactiveRouter = _ReactiveRouter, doc = document) {
  const setLocation = ({ params }) => { store.dispatch(actions.setLocation(params)); };
  const createFile = ({ params }) => { setLocation({ params: { ...params, verb: 'new' } }); };

  const router = ReactiveRouter({
    '/:owner?/:repo?/:branch?/': setLocation,
    '/:owner/:repo/:branch/:path(.*)/new': createFile,
    '/:owner/:repo/:branch/:path(.*)': setLocation
  });

  store.subscribe(() => {
    const { location: { owner, repo, branch, path, verb } } = store.getState();
    const fullPath = [owner, repo, branch, path, verb].filter(Boolean).join('/');
    doc.title = 'Content Editor ' + fullPath;
    router.setSilent('/' + fullPath);
  });
}

