import { assert } from 'chai';
import sinon from 'sinon';
import contents from '../../src/reducers/contents';
import { LOGIN, LOGOUT, LOAD } from '../../src/constants/action-types';
import { COMPLETED } from '../../src/constants/status-types';
import { PATH } from '../../src/constants/location-types';

describe('contents', function() {
  it("caches user's repos to root on login", function() {
    let action = {
      type: LOGIN,
      status: COMPLETED,
      repos: [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    assert.deepEqual(contents({}, action), {
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    });
  });

  it('forgets everything on logout', function() {
    let state = {
      '/NeoDude/Lazerly/master': [
        { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
        { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
      ],
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    let action = { type: LOGOUT, status: COMPLETED };
    assert.deepEqual(contents(state, action), {});
  });

  it('loads contents', function() {
    let state = {
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    let action = {
      type: LOAD,
      status: COMPLETED,
      location: {
        href: '/NeoDude/Lazerly/gh-pages',
        type: PATH,
        owner: 'NeoDude',
        repo: 'Lazerly',
        branch: 'gh-pages',
        path: ''
      },
      contents: [
        { label: 'assets', location: '/NeoDude/Lazerly/gh-pages/assets', type: 'dir' },
        { label: 'index.html', location: '/NeoDude/Lazerly/gh-pages/index.html', type: 'file' }
      ]
    };

    assert.deepEqual(contents(state, action), {
      '/NeoDude/Lazerly/gh-pages': [
        { label: 'assets', location: '/NeoDude/Lazerly/gh-pages/assets', type: 'dir' },
        { label: 'index.html', location: '/NeoDude/Lazerly/gh-pages/index.html', type: 'file' }
      ],
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    });
  });

  it('ignores loaded files', function() {
    let state = {
      '/NeoDude/Lazerly/master': [
        { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
        { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
      ],
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    let action = {
      type: LOAD,
      status: COMPLETED,
      file: { text: 'puts "Whatup world?"\n' }
    };

    assert.deepEqual(contents(state, action), state);
  });
});
