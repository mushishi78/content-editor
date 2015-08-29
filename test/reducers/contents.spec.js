import { assert } from 'chai';
import sinon from 'sinon';
import contents from '../../src/reducers/contents';
import { LOGIN, LOGOUT, LOAD, SAVE, MOVE, REMOVE } from '../../src/constants/action-types';
import { COMPLETED } from '../../src/constants/status-types';
import { PATH } from '../../src/constants/location-types';

describe('contents', function() {
  it("stores user's repos on login", function() {
    const action = {
      type: LOGIN,
      status: COMPLETED,
      repos: ['/NeoDude/Lazerly', '/NeoDude/JzzT']
    };

    assert.deepEqual(contents({}, action), {
      '/NeoDude': 'owner',
      '/NeoDude/Lazerly': 'repo',
      '/NeoDude/JzzT': 'repo'
    });
  });

  it('loads contents', function() {
    const action = {
      type: LOAD,
      status: COMPLETED,
      contents: [
        { href: '/NeoDude/Lazerly/gh-pages/assets', type: 'dir' },
        { href: '/NeoDude/Lazerly/gh-pages/index.html', type: 'file' }
      ]
    };

    assert.deepEqual(contents({}, action), {
      '/NeoDude': 'owner',
      '/NeoDude/Lazerly': 'repo',
      '/NeoDude/Lazerly/gh-pages': 'branch',
      '/NeoDude/Lazerly/gh-pages/assets': 'dir',
      '/NeoDude/Lazerly/gh-pages/index.html': 'file',
    });
  });

  it('ignores loaded files', function() {
    const state = { '/NeoDude': 'owner' };

    const action = {
      type: LOAD,
      status: COMPLETED,
      file: { text: 'puts "Whatup world?"\n' }
    };

    assert.deepEqual(contents(state, action), state);
  });

  it('adds file on save', function() {
    const action = {
      type: SAVE,
      status: COMPLETED,
      location: { href: '/NeoDude/Lazerly/master/lib/index.js' }
    };

    assert.deepEqual(contents({}, action), {
      '/NeoDude': 'owner',
      '/NeoDude/Lazerly': 'repo',
      '/NeoDude/Lazerly/master': 'branch',
      '/NeoDude/Lazerly/master/lib': 'dir',
      '/NeoDude/Lazerly/master/lib/index.js': 'file'
    });
  });

  it('moves files', function() {
    const state = {
      '/NeoDude': 'owner',
      '/NeoDude/Lazerly': 'repo',
      '/NeoDude/Lazerly/master': 'branch',
      '/NeoDude/Lazerly/master/app.js': 'file'
    };

    const action = {
      type: MOVE,
      status: COMPLETED,
      location: {
        href: '/NeoDude/Lazerly/master',
        type: PATH,
        owner: 'NeoDude',
        repo: 'Lazerly',
        branch: 'master',
        path: ''
      },
      oldPath: 'app.js',
      newPath: 'src/main.js'
    };

    assert.deepEqual(contents(state, action), {
      '/NeoDude': 'owner',
      '/NeoDude/Lazerly': 'repo',
      '/NeoDude/Lazerly/master': 'branch',
      '/NeoDude/Lazerly/master/src': 'dir',
      '/NeoDude/Lazerly/master/src/main.js': 'file'
    });
  });

  it('removes files but not containing folder', function() {
    const state = {
      '/NeoDude': 'owner',
      '/NeoDude/Lazerly': 'repo',
      '/NeoDude/Lazerly/master': 'branch',
      '/NeoDude/Lazerly/master/src': 'dir',
      '/NeoDude/Lazerly/master/src/main.js': 'file'
    };

    const action = {
      type: REMOVE,
      status: COMPLETED,
      location: {
        href: '/NeoDude/Lazerly/master/src',
        type: PATH,
        owner: 'NeoDude',
        repo: 'Lazerly',
        branch: 'master',
        path: 'src'
      },
      path: 'src/main.js'
    };

    assert.deepEqual(contents(state, action), {
      '/NeoDude': 'owner',
      '/NeoDude/Lazerly': 'repo',
      '/NeoDude/Lazerly/master': 'branch',
      '/NeoDude/Lazerly/master/src': 'dir'
    });
  });
});
