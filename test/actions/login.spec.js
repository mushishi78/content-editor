import { assert } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import login from '../../src/actions/login';
import { LOGIN } from '../../src/constants/action-types';
import { IN_PROGRESS, COMPLETED, FAILED } from '../../src/constants/status-types';

sinonStubPromise(sinon);

describe('login', function() {
  const accessToken = 'RE54644646D5';

  const githubRepos = [
    { full_name: 'NeoDude/Lazerly', stars: 2 },
    { full_name: 'shck-plc/fizl', stars: 12 }
  ];

  const parsedRepos = ['/NeoDude/Lazerly', '/shck-plc/fizl'];

  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.load = () => 'load';
    this.github = { repos: sinon.stub().returnsPromise() };
    this.GHPromiser = sinon.stub().withArgs(accessToken).returns(this.github);
    this.storage = { getItem: sinon.stub(), setItem: sinon.spy(), removeItem: sinon.spy() };
  });

  it('ignores if accessToken not given or stored', function() {
    login({}, this.GHPromiser, this.load, this.storage)(this.dispatch)
    assert(this.dispatch.notCalled)
  });

  it('stores, dispatches and loads if accessToken given and GitHub returns repos', function() {
    this.github.repos.resolves(githubRepos);

    login({ accessToken }, this.GHPromiser, this.load, this.storage)(this.dispatch);

    assert.deepEqual(this.storage.setItem.args[0], ['accessToken', accessToken]);
    assert.deepEqual(this.dispatch.args[0][0], { type: LOGIN, status: IN_PROGRESS });
    assert.deepEqual(this.dispatch.args[1][0], {
      type: LOGIN,
      status: COMPLETED,
      github: this.github,
      repos: parsedRepos
    });
    assert.equal(this.dispatch.args[2][0], 'load');
  });

  it('dispatches and loads if accessToken stored and GitHub returns repos', function() {
    this.storage.getItem.withArgs('accessToken').returns(accessToken);
    this.github.repos.resolves(githubRepos);

    login({}, this.GHPromiser, this.load, this.storage)(this.dispatch);

    assert.deepEqual(this.dispatch.args[0][0], { type: LOGIN, status: IN_PROGRESS });
    assert.deepEqual(this.dispatch.args[1][0], {
      type: LOGIN,
      status: COMPLETED,
      github: this.github,
      repos: parsedRepos
    });
    assert.equal(this.dispatch.args[2][0], 'load');
  });

  it('fails if accessToken given but GitHub fails', function() {
    this.github.repos.rejects({ message: 'Not Authorized' });
    login({ accessToken }, this.GHPromiser, this.load, this.storage)(this.dispatch);

    assert.deepEqual(this.dispatch.args[0][0], { type: LOGIN, status: IN_PROGRESS });
    assert.deepEqual(this.dispatch.args[1][0], {
      type: LOGIN, status: FAILED, flash: 'Not Authorized'
    });
    assert(this.dispatch.calledTwice);
  });

  it('accessToken undefined remove from storage', function() {
    login({}, this.GHPromiser, this.load, this.storage)(this.dispatch);
    assert(this.storage.setItem.notCalled);
    assert.equal(this.storage.removeItem.args[0][0], 'accessToken');
  });
});
