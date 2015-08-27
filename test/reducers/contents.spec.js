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

  describe('SAVE', function() {
    it('adds file to folder on save, if folder loaded', function() {
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

      assert.deepEqual(contents(state, action), {
        '/NeoDude/Lazerly/master': [
          { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
          { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' },
          { label: 'README.md', location: '/NeoDude/Lazerly/master/README.md', type: 'file' }
        ],
        '/': [
          { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
          { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
        ]
      });
    });

    it('keeps file in folder on save if folder loaded and already has file', function() {
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
          href: '/NeoDude/Lazerly/master/app.rb',
          type: PATH,
          owner: 'NeoDude',
          repo: 'Lazerly',
          branch: 'master',
          path: 'app.rb'
        },
      };

      assert.deepEqual(contents(state, action), state);
    });

    it('ignores files saved in folders that are not loaded', function() {
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
          href: '/NeoDude/Lazerly/master/lib/version.rb',
          type: PATH,
          owner: 'NeoDude',
          repo: 'Lazerly',
          branch: 'master',
          path: 'lib/version.rb'
        },
      };

      assert.deepEqual(contents(state, action), state);
    });

    it('adds parent folder if grandparent loaded', function() {
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
          href: '/NeoDude/Lazerly/master/bin/Lazerly.exe',
          type: PATH,
          owner: 'NeoDude',
          repo: 'Lazerly',
          branch: 'master',
          path: 'bin/Lazerly.exe'
        },
      };

      assert.deepEqual(contents(state, action), {
        '/NeoDude/Lazerly/master': [
          { label: 'bin', location: '/NeoDude/Lazerly/master/bin', type: 'dir' },
          { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
          { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
        ],
        '/': [
          { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
          { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
        ]
      });
    });
  });

  describe('MOVE', function() {
    it('moves file to other folder if both loaded', function() {
      const state = {
        '/NeoDude/Lazerly/master': [
          { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
          { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
        ],
        '/NeoDude/Lazerly/master/lib': [
          { label: 'lazer.rb', location: '/NeoDude/Lazerly/master/lazer.rb', type: 'file' },
          { label: 'version.rb', location: '/NeoDude/Lazerly/master/version.rb', type: 'file' }
        ],
        '/': [
          { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
          { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
        ]
      };

      const action = {
        type: MOVE,
        status: COMPLETED,
        location: {
          href: '/NeoDude/Lazerly/master/lib',
          type: PATH,
          owner: 'NeoDude',
          repo: 'Lazerly',
          branch: 'master',
          path: 'lib'
        },
        oldPath: 'lib/lazer.rb',
        newPath: 'lazer.rb'
      };

      assert.deepEqual(contents(state, action), {
        '/NeoDude/Lazerly/master': [
          { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
          { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' },
          { label: 'lazer.rb', location: '/NeoDude/Lazerly/master/lazer.rb', type: 'file' }
        ],
        '/NeoDude/Lazerly/master/lib': [
          { label: 'version.rb', location: '/NeoDude/Lazerly/master/version.rb', type: 'file' }
        ],
        '/': [
          { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
          { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
        ]
      });
    });

    it('removes file if other folder not loaded', function() {
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
        oldPath: 'app.rb',
        newPath: 'lib/app.rb'
      };

      assert.deepEqual(contents(state, action), {
        '/NeoDude/Lazerly/master': [
          { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' }
        ],
        '/': [
          { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
          { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
        ]
      });
    });
  });
});
