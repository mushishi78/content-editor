import { assert } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import load from '../../src/actions/load';
import { LOAD } from '../../src/constants/action-types';
import { INITIATED, COMPLETED, FAILED } from '../../src/constants/status-types';

sinonStubPromise(sinon);

describe('load', function() {
  const owner      = 'NeoDude',
        repo       = 'Lazerly',
        branch     = 'master',
        path       = 'lib',
        verb       = 'new',
        failAction = { type: LOAD, status: FAILED, flash: 'Not Found' };

  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.getState = sinon.stub();
    this.github = {};
    this.atob = sinon.stub();
  });

  it('creates a new file without checking GitHub to see if the location exists', function() {
    this.getState.returns({
      location: { owner, repo, branch, path: 'pages/about.md', verb },
      github: this.github
    });

    load(this.atob)(this.dispatch, this.getState);

    assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
    assert.deepEqual(this.dispatch.args[1][0], {
      type: LOAD,
      status: COMPLETED,
      file: { name: 'about.md' }
    });
  });

  describe('listBranches', function() {
    beforeEach(function() {
      this.github.listBranches = sinon.stub().returnsPromise();
    });

    it('dispatches list of branches if location is a repo', function() {
      this.getState.returns({ location: { owner, repo }, github: this.github });
      this.github.listBranches.resolves(['master', 'gh-pages']);

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.github.listBranches.args[0][0], { owner, repo });
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        list: [
          { label: 'master',   location: { branch: 'master'   }, type: 'branch' },
          { label: 'gh-pages', location: { branch: 'gh-pages' }, type: 'branch' }
        ]
      });
    });

    it('dispatches fail if github fails', function() {
      this.getState.returns({ location: { owner, repo }, github: this.github });
      this.github.listBranches.rejects({ request: { statusText: 'Not Found' } });

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.github.listBranches.args[0][0], { owner, repo });
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
      assert.deepEqual(this.dispatch.args[1][0], failAction);
    });
  });

  describe('contents', function() {
    beforeEach(function() {
      this.github.contents = sinon.stub().returnsPromise();
    });

    it('dispatches file if location is a file', function() {
      this.getState.returns({
        location: { owner, repo, branch, path: 'index.js' },
        github: this.github
      });

      this.github.contents.resolves({
        name: 'index.js',
        content: '08t24h8thw4iugw47gf74w8u2',
        size: 232
      });

      this.atob.returns('console.log("Hello World");')

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.github.contents.args[0][0], { owner, repo, branch, path: 'index.js' });
      assert(this.atob.calledWith('08t24h8thw4iugw47gf74w8u2'));
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        file: {
          name: 'index.js',
          content: 'console.log("Hello World");'
        }
      });
    });

    it('dispatches list of files and folders if location is a folder', function() {
      this.getState.returns({
        location: { owner, repo, branch, path },
        github: this.github
      });

      this.github.contents.resolves([
        { name: 'snap.c',  path: 'lib/snap.c',  type: 'file', size: 93  },
        { name: 'crackle', path: 'lib/crackle', type: 'dir',  size: 0   },
        { name: '.pop',    path: 'lib/.pop',    type: 'file', size: 112 }
      ]);

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.github.contents.args[0][0], { owner, repo, branch, path });
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        list: [
          { label: 'snap.c',  location: { path: 'lib/snap.c'  }, type: 'file' },
          { label: 'crackle', location: { path: 'lib/crackle' }, type: 'dir'  },
          { label: '.pop',    location: { path: 'lib/.pop'    }, type: 'file' }
        ]
      });
    });

    it('dispatches fail if github fails', function() {
      this.getState.returns({
        location: { owner, repo, branch, path: 'index.j' },
        github: this.github
      });

      this.github.contents.rejects({ request: { statusText: 'Not Found' } });

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.github.contents.args[0][0], { owner, repo, branch, path: 'index.j' });
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
      assert.deepEqual(this.dispatch.args[1][0], failAction);
    });
  });

  describe('getOwnersRepos', function() {
    beforeEach(function() {
      this.github.userRepos = sinon.stub().returnsPromise();
      this.github.orgRepos  = sinon.stub().returnsPromise();
    });

    it('dispatches list of repos if location is an owner and owner is a user', function() {
      this.getState.returns({ location: { owner }, github: this.github });

      this.github.userRepos.resolves([
        { name: repo,      owner: { login: owner }, stars: 2 },
        { name: 'fish-js', owner: { login: owner }, stars: 5 }
      ]);

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.github.userRepos.args[0][0], { owner });
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        list: [
          { label: repo,      location: { owner, repo            }, type: 'repo' },
          { label: 'fish-js', location: { owner, repo: 'fish-js' }, type: 'repo' }
        ]
      });
    });

    it('dispatches list of repos if location is an owner and owner is a org', function() {
      this.getState.returns({ location: { owner: 'shck-plc' }, github: this.github });

      this.github.userRepos.resolves([]);
      this.github.orgRepos.resolves([
        { name: 'fizl', owner: { login: 'shck-plc' }, stars: 12 },
        { name: 'lift', owner: { login: 'shck-plc' }, stars: 5  }
      ]);

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.github.userRepos.args[0][0], { owner: 'shck-plc' });
      assert.deepEqual(this.github.orgRepos.args[0][0], { owner: 'shck-plc' });
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        list: [
          { label: 'fizl', location: { owner: 'shck-plc', repo: 'fizl' }, type: 'repo' },
          { label: 'lift', location: { owner: 'shck-plc', repo: 'lift' }, type: 'repo' }
        ]
      });
    });

    it('dispatches fail if github fails', function() {
      this.getState.returns({ location: { owner }, github: this.github });
      this.github.userRepos.rejects({ request: { statusText: 'Not Found' } });

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.github.userRepos.args[0][0], { owner });
      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
      assert.deepEqual(this.dispatch.args[1][0], failAction);
    });
  });

  describe('getRepos', function() {
    beforeEach(function() {
      this.github.repos = sinon.stub().returnsPromise();
    });

    it('dispatches list of users repos if at root', function() {
      this.getState.returns({ location: {}, repos: 'Cached Repos' });

      load(this.atob)(this.dispatch, this.getState);

      assert.deepEqual(this.dispatch.args[0][0], { type: LOAD, status: INITIATED });
      assert.deepEqual(this.dispatch.args[1][0], {
        type: LOAD,
        status: COMPLETED,
        list: 'Cached Repos'
      });
    });
  });
});
