import { assert } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import move from '../../src/actions/move';
import { MOVE } from '../../src/constants/action-types';
import { IN_PROGRESS, COMPLETED, FAILED } from '../../src/constants/status-types';

sinonStubPromise(sinon);

describe('move', function() {
  const location = { href: 'NeoDude/Lazerly/master/lib' },
        oldPath  = 'lib/index.js',
        newPath  = 'src/index.js';

  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.github = { move: sinon.stub().returnsPromise() };
    this.getState = () => ({ location, github: this.github });
  });

  afterEach(function() {
    assert(this.github.move.calledWith(location, oldPath, newPath));
    assert.deepEqual(this.dispatch.args[0][0], { type: MOVE, status: IN_PROGRESS });
  })

  it('mvoes and dispatches complete', function() {
    this.github.move.resolves();
    move(oldPath, newPath)(this.dispatch, this.getState);

    assert.deepEqual(this.dispatch.args[1][0], {
      type: MOVE,
      status: COMPLETED,
      location,
      oldPath,
      newPath
    });
  });

  it('dispatches failed when github fails', function() {
    this.github.move.rejects({ message: 'Not Found' });
    move(oldPath, newPath)(this.dispatch, this.getState);
    assert.deepEqual(this.dispatch.args[1][0], { type: MOVE, status: FAILED, flash: 'Not Found' });
  });
});
