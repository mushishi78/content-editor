import { assert } from 'chai';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';
import upload from '../../src/actions/upload';
import { UPLOAD } from '../../src/constants/action-types';
import { IN_PROGRESS, COMPLETED, FAILED } from '../../src/constants/status-types';

sinonStubPromise(sinon);

describe('upload', function() {
  const name    = 'apple.png',
        text    = 'puts "Hello World!"',
        comment = 'Initial commit';

  const locationBefore = { href: '/NeoDude/Lazerly/master/img', path: 'img' };
  const locationAfter = {
    href: '/NeoDude/Lazerly/master/img/apple.png',
    path: 'img/apple.png'
  };


  beforeEach(function() {
    this.dispatch = sinon.spy();
    this.github = { write: sinon.stub().returnsPromise() };
    this.getState = () => ({ location: locationBefore, github: this.github });
  });

  afterEach(function() {
    assert(this.github.write.calledWith(locationAfter, text, comment));
    assert.deepEqual(this.dispatch.args[0][0], { type: UPLOAD, status: IN_PROGRESS });
  })

  it('writes and dispatches complete', function() {
    this.github.write.resolves();
    upload(name, text, comment)(this.dispatch, this.getState);

    assert.deepEqual(this.dispatch.args[1][0], {
      type: UPLOAD,
      status: COMPLETED,
      location: locationAfter
    });
  });

  it('dispatches failed when github fails', function() {
    this.github.write.rejects({ message: 'Not Found' });
    upload(name, text, comment)(this.dispatch, this.getState);

    assert.deepEqual(this.dispatch.args[1][0], {
      type: UPLOAD,
      status: FAILED,
      flash: 'Not Found'
    });
  });
});
