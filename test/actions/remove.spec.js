import { assert } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import remove from '../../src/actions/remove';
import { REMOVE } from '../../src/constants/action-types';
import { IN_PROGRESS, COMPLETED, FAILED } from '../../src/constants/status-types';

sinonStubPromise(sinon);

describe('remove', function() {
  const location = { href: 'NeoDude/Lazerly/master/lib' },
        path  = 'lib/index.js';

  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.github = { remove: sinon.stub().returnsPromise() };
    this.getState = () => ({ location, github: this.github });
  });

  afterEach(function() {
    assert(this.github.remove.calledWith(location, path));
    assert.deepEqual(this.dispatch.args[0][0], { type: REMOVE, status: IN_PROGRESS });
  })

  it('mvoes and dispatches complete', function() {
    this.github.remove.resolves();
    remove(path)(this.dispatch, this.getState);
    assert.deepEqual(this.dispatch.args[1][0], {
      type: REMOVE,
      status: COMPLETED,
      location,
      path
    });
  });

  it('dispatches failed when github fails', function() {
    this.github.remove.rejects({ request: { statusText: 'Not Found' } });
    remove(path)(this.dispatch, this.getState);
    assert.deepEqual(this.dispatch.args[1][0], {
      type: REMOVE,
      status: FAILED,
      flash: 'Not Found'
    });
  });
});
