import { assert } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import load from '../../src/actions/load';
import { LOAD } from '../../src/constants/action-types';
import { IN_PROGRESS, COMPLETED, FAILED } from '../../src/constants/status-types';
import { OWNER, REPO, PATH } from '../../src/constants/location-types';

sinonStubPromise(sinon);

describe('load', function() {
  const failReply = { message: "Not Found" };
  const failAction = { type: LOAD, status: FAILED, flash: 'Not Found' };

  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.github = {};
    this.atob = sinon.stub();
    this.location = {};
    this.loaded = { '/NeoDude/Lazerly/master': true, '/': true };
    this.state = { github: this.github, location: this.location, loaded: this.loaded };
    this.getState = () => this.state;
  });

  it('ignores if contents already loaded', function() {
    this.location.href = '/NeoDude/Lazerly/master';
    load(this.atob)(this.dispatch, this.getState);
    assert(this.dispatch.notCalled);
  });

  describe('listBranches', function() {
    beforeEach(function() {
      this.github.listBranches = sinon.stub().returnsPromise();
      this.location.href = '/NeoDude/Lazerly';
      this.location.type = REPO;
    });

    afterEach(function() {
      assert.deepEqual(this.github.listBranches.args[0][0], this.location);
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: IN_PROGRESS });
    });

    it('dispatches list of branches if location is a repo', function() {
      this.github.listBranches.resolves(['master', 'gh-pages']);
      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        href: this.location.href,
        contents: [
          { href: '/NeoDude/Lazerly/master',   type: 'branch' },
          { href: '/NeoDude/Lazerly/gh-pages', type: 'branch' }
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
      this.location.type = PATH;
    });

    afterEach(function() {
      assert.deepEqual(this.github.contents.args[0][0], this.location);
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: IN_PROGRESS });
    });

    it('dispatches file if location is a file', function() {
      this.location.href = '/NeoDude/Lazerly/master/index.js';
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
      this.location.href = '/NeoDude/Lazerly/master/lib';
      this.github.contents.resolves([
        { name: 'snap.c',  type: 'file', size: 93  },
        { name: 'crackle', type: 'dir',  size: 0   },
        { name: '.pop',    type: 'file', size: 112 }
      ]);

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        href: this.location.href,
        contents: [
          { href: '/NeoDude/Lazerly/master/lib/snap.c' , type: 'file' },
          { href: '/NeoDude/Lazerly/master/lib/crackle', type: 'dir'  },
          { href: '/NeoDude/Lazerly/master/lib/.pop',    type: 'file' }
        ]
      });
    });

    it('dispatches fail if github fails', function() {
      this.location.href = '/NeoDude/Lazerly/master/index.j';
      this.github.contents.rejects(failReply);
      load(this.atob)(this.dispatch, this.getState);
      assert.deepEqual(this.dispatch.args[1][0], failAction);
    });
  });

  describe('getOwnersRepos', function() {
    beforeEach(function() {
      this.github.userRepos = sinon.stub().returnsPromise();
      this.github.orgRepos  = sinon.stub().returnsPromise();
      this.location.type = OWNER;
    });

    afterEach(function() {
      assert.deepEqual(this.github.userRepos.args[0][0], this.location);
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: IN_PROGRESS });
    });

    it('dispatches list of repos if location is an owner and owner is a user', function() {
      this.location.href = '/NeoDude';
      this.github.userRepos.resolves([
        { full_name: 'NeoDude/Lazerly', stars: 2 },
        { full_name: 'NeoDude/fish-js', stars: 5 }
      ]);

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        href: this.location.href,
        contents: [
          { href: '/NeoDude/Lazerly', type: 'repo' },
          { href: '/NeoDude/fish-js', type: 'repo' }
        ]
      });
    });

    it('dispatches list of repos if location is an owner and owner is a org', function() {
      this.location.href = '/shck-plc';
      this.github.userRepos.resolves([]);
      this.github.orgRepos.resolves([
        { full_name: 'shck-plc/fizl', stars: 12 },
        { full_name: 'shck-plc/lift', stars: 5  }
      ]);

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.github.orgRepos.args[0][0], this.location);
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        href: this.location.href,
        contents: [
          { href: '/shck-plc/fizl', type: 'repo' },
          { href: '/shck-plc/lift', type: 'repo' }
        ]
      });
    });

    it('dispatches fail if github fails', function() {
      this.location.href = '/shck-plc';
      this.github.userRepos.rejects(failReply);
      load(this.atob)(this.dispatch, this.getState);
      assert.deepEqual(this.dispatch.args[1][0], failAction);
    });
  });
});
