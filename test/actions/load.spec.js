import { assert } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import load from '../../src/actions/load';
import { LOAD } from '../../src/constants/action-types';
import { INITIATED, COMPLETED, FAILED } from '../../src/constants/status-types';

sinonStubPromise(sinon);

describe('load', function() {
  const failReply = { request: { statusText: 'Not Found' } };
  const failAction = { type: LOAD, status: FAILED, flash: 'Not Found' };

  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.github = {};
    this.atob = sinon.stub();
    this.state = {
      github: this.github,
      locations: {
        '/NeoDude/Lazerly/master': [
          { label: 'lib', location: '/NeoDude/Lazerly/master/lib', type: 'dir' },
          { label: 'app.rb', location: '/NeoDude/Lazerly/master/app.rb', type: 'file' }
        ],
        '/': [
          { label: 'NeoDude/Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
          { label: 'NeoDude/JzzT', location: '/NeoDude/JzzT', type: 'repo' }
        ]
      }
    };
    this.getState = () => this.state;
  });

  it('ignores if contents already loaded', function() {
    this.state.locations.current = '/NeoDude/Lazerly/master';
    load(this.atob)(this.dispatch, this.getState);
    assert(this.dispatch.notCalled);
  });

  describe('listBranches', function() {
    beforeEach(function() {
      this.github.listBranches = sinon.stub().returnsPromise();
      this.state.locations.current = '/NeoDude/Lazerly';
    });

    afterEach(function() {
      assert.equal(this.github.listBranches.args[0][0], this.state.locations.current);
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
    });

    it('dispatches list of branches if location is a repo', function() {
      this.github.listBranches.resolves(['master', 'gh-pages']);
      load(this.atob)(this.dispatch, this.getState);
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        contents: [
          { label: 'master',   location: '/NeoDude/Lazerly/master',   type: 'branch' },
          { label: 'gh-pages', location: '/NeoDude/Lazerly/gh-pages', type: 'branch' }
        ]
      });
    });

    it('dispatches fail if github fails', function() {
      this.github.listBranches.rejects(failReply);
      load(this.atob)(this.dispatch, this.getState);
      assert.deepEqual(this.dispatch.args[1][0], failAction);
    });
  });

  describe('contents', function() {
    beforeEach(function() {
      this.github.contents = sinon.stub().returnsPromise();
    });

    afterEach(function() {
      assert.equal(this.github.contents.args[0][0], this.state.locations.current);
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
    });

    it('dispatches file if location is a file', function() {
      this.state.locations.current = '/NeoDude/Lazerly/master/index.js';
      this.atob.returns('console.log("Hello World");')
      this.github.contents.resolves({
        content: '08t24h8thw4iugw47gf74w8u2',
        size: 232
      });

      load(this.atob)(this.dispatch, this.getState);

      assert(this.atob.calledWith('08t24h8thw4iugw47gf74w8u2'));
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        file: { text: 'console.log("Hello World");' }
      });
    });

    it('dispatches list of files and folders if location is a folder', function() {
      this.state.locations.current = '/NeoDude/Lazerly/master/lib';
      this.github.contents.resolves([
        { name: 'snap.c',  type: 'file', size: 93  },
        { name: 'crackle', type: 'dir',  size: 0   },
        { name: '.pop',    type: 'file', size: 112 }
      ]);

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        contents: [
          { label: 'snap.c',  location: '/NeoDude/Lazerly/master/lib/snap.c' , type: 'file' },
          { label: 'crackle', location: '/NeoDude/Lazerly/master/lib/crackle', type: 'dir'  },
          { label: '.pop',    location: '/NeoDude/Lazerly/master/lib/.pop',    type: 'file' }
        ]
      });
    });

    it('dispatches fail if github fails', function() {
      this.state.locations.current = '/NeoDude/Lazerly/master/index.j';
      this.github.contents.rejects(failReply);
      load(this.atob)(this.dispatch, this.getState);
      assert.deepEqual(this.dispatch.args[1][0], failAction);
    });
  });

  describe('getOwnersRepos', function() {
    beforeEach(function() {
      this.github.userRepos = sinon.stub().returnsPromise();
      this.github.orgRepos  = sinon.stub().returnsPromise();
    });

    afterEach(function() {
      assert.equal(this.github.userRepos.args[0][0], this.state.locations.current);
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
    });

    it('dispatches list of repos if location is an owner and owner is a user', function() {
      this.state.locations.current = '/NeoDude';
      this.github.userRepos.resolves([
        { name: 'Lazerly', full_name: 'NeoDude/Lazerly', stars: 2 },
        { name: 'fish-js', full_name: 'NeoDude/fish-js', stars: 5 }
      ]);

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        contents: [
          { label: 'Lazerly', location: '/NeoDude/Lazerly', type: 'repo' },
          { label: 'fish-js', location: '/NeoDude/fish-js', type: 'repo' }
        ]
      });
    });

    it('dispatches list of repos if location is an owner and owner is a org', function() {
      this.state.locations.current = '/shck-plc';
      this.github.userRepos.resolves([]);
      this.github.orgRepos.resolves([
        { name: 'fizl', full_name: 'shck-plc/fizl', stars: 12 },
        { name: 'lift', full_name: 'shck-plc/lift', stars: 5  }
      ]);

      load(this.atob)(this.dispatch, this.getState);

      assert.equal(this.github.orgRepos.args[0][0], '/shck-plc');
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        contents: [
          { label: 'fizl', location: '/shck-plc/fizl', type: 'repo' },
          { label: 'lift', location: '/shck-plc/lift', type: 'repo' }
        ]
      });
    });

    it('dispatches fail if github fails', function() {
      this.state.locations.current = '/shck-plc';
      this.github.userRepos.rejects(failReply);
      load(this.atob)(this.dispatch, this.getState);
      assert.deepEqual(this.dispatch.args[1][0], failAction);
    });
  });
});
