import { assert } from 'chai';
import sinon from 'sinon';
import createRouter from '../src/routes';
import * as actionTypes from '../src/constants/action-types';

describe('createRouter', function() {
  it('pushes location on change', function() {
    let location = { owner: 'danger58', repo: 'friKtion' };

  	let store = {
  		subscribe: sinon.stub().callsArg(0),
  		getState: sinon.stub().returns({ location: location })
  	};

    let router = { setSilent: sinon.spy() };
  	let Router = () => { return router; };
    let doc = {};

  	createRouter(store, Router, doc);
  	assert(router.setSilent.calledWith('/danger58/friKtion'));
    assert.equal(doc.title, 'Content Editor danger58/friKtion');
  });
});
