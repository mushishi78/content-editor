import { assert } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import save from '../../src/actions/save';
import { SAVE } from '../../src/constants/action-types';
import { INITIATED, COMPLETED, FAILED } from '../../src/constants/status-types';

sinonStubPromise(sinon);

describe('save', function() {
  const locations = { current: 'NeoDude/Lazerly/master/app.rb' },
        text      = 'puts "Hello World!"',
        comment   = 'Initial commit';

  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.github = { write: sinon.stub().returnsPromise() };
    this.getState = () => ({ locations, github: this.github, file: { text } });
  });

  afterEach(function() {
    assert(this.github.write.calledWith(locations.current, text, comment));
    assert.deepEqual(this.dispatch.args[0][0], { type: SAVE, status: INITIATED });
  })

  it('writes and dispatches complete', function() {
    this.github.write.resolves();
    save(comment)(this.dispatch, this.getState);
    assert.deepEqual(this.dispatch.args[1][0], { type: SAVE, status: COMPLETED, flash: 'Saved!' });
  });

  it('dispatches failed when github fails', function() {
    this.github.write.rejects({ request: { statusText: 'Not Found' } });
    save(comment)(this.dispatch, this.getState);
    assert.deepEqual(this.dispatch.args[1][0], { type: SAVE, status: FAILED, flash: 'Not Found' });
  });
});
