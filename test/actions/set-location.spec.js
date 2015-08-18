import { assert } from 'chai';
import sinon from 'sinon';
import setLocation from '../../src/actions/set-location';
import { SET_LOCATION } from '../../src/constants/action-types';

describe('setLocation', function() {
  beforeEach(function() {
    this.getState = sinon.stub();
    this.dispatch = sinon.spy();
    this.load = sinon.stub().returns('load');
  });

  it('dispatches nothing if location has not changed', function() {
    let location = { owner: 'dgaer58', repo: 'friKtion' };
    let previous = { owner: 'dgaer58', repo: 'friKtion' };
    this.getState.returns({ location: previous, loggedIn: true });
  	setLocation(location, this.load)(this.dispatch, this.getState);
  	assert(this.dispatch.notCalled);
  });

  it('fills missing location parts from previous and dispatches, calling load if logged in', function() {
    let location = { owner: 'js8on', branch: 'master' };
    let previous = {
      owner: 'dgaer58',
      repo: 'friKtion',
      branch: 'master',
      path: 'lib/run.rb'
    };

    this.getState.returns({ location: previous, loggedIn: true });
    setLocation(location, this.load)(this.dispatch, this.getState);

    let expected = { type: SET_LOCATION, repo: 'friKtion', ...location };
    assert.deepEqual(this.dispatch.args[0][0], expected);
    assert.equal(this.dispatch.args[1][0], 'load');
  });

  it('dispatches without calling load if logged out', function() {
    let location = { owner: 'js8on', repo: 'friKtion' };
    this.getState.returns({ location: {}, loggedIn: false });
    setLocation(location, this.load)(this.dispatch, this.getState);
    assert(this.dispatch.calledOnce);
  });
});
