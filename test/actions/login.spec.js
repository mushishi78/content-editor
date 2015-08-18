import { assert } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import login from '../../src/actions/login';
import { LOGIN } from '../../src/constants/action-types';
import { INITIATED, COMPLETED, FAILED } from '../../src/constants/status-types';

sinonStubPromise(sinon);

describe('login', function() {
  const username = 'FrnkY89',
        password = 'LemonPops';

  const githubRepos = [
    {
      name: 'Lazerly',
      full_name: 'NeoDude/Lazerly',
      owner: { login: 'NeoDude' },
      stars: 2
    },
    {
      name: 'fizl',
      full_name: 'shck-plc/fizl',
      owner: { login: 'shck-plc' },
      stars: 12
    }
  ];

  const parsedRepos = [
    {
      label: 'NeoDude/Lazerly',
      location: { owner: 'NeoDude', repo: 'Lazerly' },
      type: 'repo'
    },
    {
      label: 'shck-plc/fizl',
      location: { owner: 'shck-plc', repo: 'fizl' },
      type: 'repo'
    }
  ];

  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.load = sinon.stub().returns('load');
    this.github = { repos: sinon.stub().returnsPromise() };
    this.GHPromiser = sinon.stub().returns(this.github);
    this.storage = { getItem: sinon.stub(), setItem: sinon.spy() };
  });

  it('ignores if credentials not given or stored', function() {
    login({}, this.GHPromiser, this.load, this.storage)(this.dispatch)
    assert(this.dispatch.notCalled)
  });

  it('ignores if only username given', function() {
    login({ username }, this.GHPromiser, this.load, this.storage)(this.dispatch)
    assert(this.dispatch.notCalled)
  });

  it('ignores if only password given', function() {
    login({ password }, this.GHPromiser, this.load, this.storage)(this.dispatch)
    assert(this.dispatch.notCalled)
  });

  it('stores, dispatches and loads if credentials given and GitHub returns repos', function() {
    this.github.repos.resolves(githubRepos);

    login({ username, password}, this.GHPromiser, this.load, this.storage)(this.dispatch);

    assert.deepEqual(this.storage.setItem.args[0], ['username', username]);
    assert.deepEqual(this.storage.setItem.args[1], ['password', password]);
    assert.deepEqual(this.dispatch.args[0][0], { type: LOGIN, status: INITIATED });
    assert.deepEqual(this.dispatch.args[1][0], {
      type: LOGIN,
      status: COMPLETED,
      github: this.github,
      repos: parsedRepos
    });
    assert.equal(this.dispatch.args[2][0], 'load');
  });

  it('dispatches and loads if credentials stored and GitHub returns repos', function() {
    this.storage.getItem.withArgs('username').returns(username);
    this.storage.getItem.withArgs('password').returns(password);
    this.github.repos.resolves(githubRepos);

    login({}, this.GHPromiser, this.load, this.storage)(this.dispatch);

    assert.deepEqual(this.dispatch.args[0][0], { type: LOGIN, status: INITIATED });
    assert.deepEqual(this.dispatch.args[1][0], {
      type: LOGIN,
      status: COMPLETED,
      github: this.github,
      repos: parsedRepos
    });
    assert.equal(this.dispatch.args[2][0], 'load');
  });

  it('fails if credentials given but GitHub fails', function() {
    this.github.repos.rejects({ request: { statusText: 'Not Authorized' } });
    login({ username, password}, this.GHPromiser, this.load, this.storage)(this.dispatch);

    assert.deepEqual(this.dispatch.args[0][0], { type: LOGIN, status: INITIATED });
    assert.deepEqual(this.dispatch.args[1][0], {
      type: LOGIN, status: FAILED, flash: 'Not Authorized'
    });
    assert(this.dispatch.calledTwice);
  });
});
