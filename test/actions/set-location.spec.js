import { assert } from 'chai';
import sinon from 'sinon';
import setLocation from '../../src/actions/set-location';
import { SET_LOCATION } from '../../src/constants/action-types';

describe('setLocation', function() {
  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.load = () => 'load';
    this.loggedIn = true;
    this.getState = () => ({
      locations: { current: '/dgaer58/friKtion' },
      loggedIn: this.loggedIn
    });
  });

  it('dispatches nothing if location unchanged', function() {
  	setLocation('/dgaer58/friKtion', this.load)(this.dispatch, this.getState);
  	assert(this.dispatch.notCalled);
  });

  it('dispatches and calls load if logged in', function() {
    setLocation('/js8on/master', this.load)(this.dispatch, this.getState);
    assert.deepEqual(this.dispatch.args[0][0], { type: SET_LOCATION, location: '/js8on/master' });
    assert.equal(this.dispatch.args[1][0], 'load');
  });

  it('dispatches without calling load if logged out', function() {
    this.loggedIn = false;
    setLocation('/js8on/master', this.load)(this.dispatch, this.getState);
    assert(this.dispatch.calledOnce);
  });
});
