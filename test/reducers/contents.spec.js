import { assert } from 'chai';
import sinon from 'sinon';
import contents from '../../src/reducers/contents';
import { LOGIN, LOGOUT, LOAD, SAVE } from '../../src/constants/action-types';
import { COMPLETED } from '../../src/constants/status-types';
import { PATH } from '../../src/constants/location-types';

describe('contents', function() {
  it("caches user's repos to root on login", function() {
    const action = {
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
    const state = {
      '/NeoDude/Lazerly/master': [
        { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
        { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
      ],
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    const action = { type: LOGOUT, status: COMPLETED };
    assert.deepEqual(contents(state, action), {});
  });

  it('loads contents', function() {
    const state = {
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    const action = {
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
    const state = {
      '/NeoDude/Lazerly/master': [
        { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
        { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
      ],
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    const action = {
      type: LOAD,
      status: COMPLETED,
      file: { text: 'puts "Whatup world?"\n' }
    };

    assert.deepEqual(contents(state, action), state);
  });

  it('uncaches parent folder on save', function() {
    const state = {
      '/NeoDude/Lazerly/master': [
        { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
        { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
      ],
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    const action = {
      type: SAVE,
      status: COMPLETED,
      location: {
        href: '/NeoDude/Lazerly/master/README.md',
        type: PATH,
        owner: 'NeoDude',
        repo: 'Lazerly',
        branch: 'master',
        path: 'README.md'
      },
    };

    const result = contents(state, action);
    assert.ok(result['/']);
    assert.notOk(result['/NeoDude/Lazerly/master']);
  });
});
