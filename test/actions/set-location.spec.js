import { assert } from 'chai';
import sinon from 'sinon';
import setLocation from '../../src/actions/set-location';
import { SET_LOCATION } from '../../src/constants/action-types';

describe('setLocation', function() {
  const origin = 'https://content-editor.surge.sh';

  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.load = () => 'load';
    this.loggedIn = true;
    this.getState = () => ({
      location: { href: '/dgaer58/friKtion' },
      loggedIn: this.loggedIn
    });
  });

  it('dispatches nothing if location unchanged', function() {
    setLocation('/dgaer58/friKtion', this.load, origin)(this.dispatch, this.getState);
    assert(this.dispatch.notCalled);
  });

  it('dispatches and calls load if logged in', function() {
    setLocation('/js8on/master', this.load, origin)(this.dispatch, this.getState);
    assert.deepEqual(this.dispatch.args[0][0], { type: SET_LOCATION, href: '/js8on/master' });
    assert.equal(this.dispatch.args[1][0], 'load');
  });

  it('dispatches without calling load if logged out', function() {
    this.loggedIn = false;
    setLocation('/js8on/master', this.load, origin)(this.dispatch, this.getState);
    assert(this.dispatch.calledOnce);
  });

  it('removes trailing slashes', function() {
    setLocation('/js8on/master/', this.load, origin)(this.dispatch, this.getState);
    assert.equal(this.dispatch.args[0][0].href, '/js8on/master');
  })
});
