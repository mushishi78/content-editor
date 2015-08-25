import { assert } from 'chai';
import sinon from 'sinon';
import locations from '../../src/reducers/locations';
import { LOGIN, LOGOUT, SET_LOCATION, LOAD } from '../../src/constants/action-types';
import { IN_PROGRESS, COMPLETED, FAILED } from '../../src/constants/status-types';

describe('locations', function() {
  it("caches user's repos to root on login", function() {
    let state = { current: '/NeoDude/Lazerly/master' };
    let action = {
      type: LOGIN,
      repos: [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    assert.deepEqual(locations(state, action), {
      current: '/NeoDude/Lazerly/master',
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    });
  });

  it('forgets everything but the current location on logout', function() {
    let state = {
      current: '/NeoDude/Lazerly/master',
      '/NeoDude/Lazerly/master': [
        { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
        { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
      ],
      '/NeoDude/Lazerly/master/lib': [
        { label: 'lazers.rb', location: '/NeoDude/Lazerly/master/lib/lazers.rb', type: 'file' }
      ],
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    let action = { type: LOGOUT };
    assert.deepEqual(locations(state, action), { current: '/NeoDude/Lazerly/master' });
  });

  it('sets current location', function() {
    let state = {
      current: '/NeoDude/Lazerly/master',
      '/NeoDude/Lazerly/master': [
        { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
        { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
      ],
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    };

    let action = { type: SET_LOCATION, location: '/NeoDude/Lazerly/gh-pages' };
    assert.deepEqual(locations(state, action), {
      current: '/NeoDude/Lazerly/gh-pages',
      '/NeoDude/Lazerly/master': [
        { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
        { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
      ],
      '/': [
        { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
        { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
      ]
    });
  });

  it('loads contents of current location', function() {
    let state = {
      current: '/NeoDude/Lazerly/gh-pages',
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
      contents: [
        { label: 'assets', location: '/NeoDude/Lazerly/gh-pages/assets', type: 'dir' },
        { label: 'index.html', location: '/NeoDude/Lazerly/gh-pages/index.html', type: 'file' }
      ]
    };

    assert.deepEqual(locations(state, action), {
      current: '/NeoDude/Lazerly/gh-pages',
      '/NeoDude/Lazerly/master': [
        { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
        { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
      ],
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
      current: '/NeoDude/Lazerly/gh-pages',
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
      file: { name: 'app.rb', text: 'puts "Whatup world?"\n' }
    };

    assert.deepEqual(locations(state, action), state);
  });
});
