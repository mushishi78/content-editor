import { assert } from 'chai';
import sinon from 'sinon';
import location from '../../src/reducers/location';
import { SET_LOCATION } from '../../src/constants/action-types';
import { OWNER, REPO, PATH } from '../../src/constants/location-types';

describe('location', function() {
  it('parses root', function() {
    const action = { type: SET_LOCATION, href: '/' };
    const result = location({}, action);
    assert.equal(result.href, '/');
    assert.equal(result.type, OWNER);
    assert.notOk(result.owner || result.repo || result.branch || result.path);
  });

  it('parses owner', function() {
    let action = { type: SET_LOCATION, href: '/dave39' };
    const result = location({}, action);
    assert.equal(result.href, '/dave39');
    assert.equal(result.type, OWNER);
    assert.equal(result.owner, 'dave39');
    assert.notOk(result.repo || result.branch || result.path);
  });

  it('parses repo', function() {
    let action = { type: SET_LOCATION, href: '/dave39/text-kart' };
    const result = location({}, action);
    assert.equal(result.href, '/dave39/text-kart');
    assert.equal(result.type, REPO);
    assert.equal(result.owner, 'dave39');
    assert.equal(result.repo, 'text-kart');
    assert.notOk(result.branch || result.path);
  });

  it('parses branch', function() {
    let action = { type: SET_LOCATION, href: '/dave39/text-kart/master' };
    const result = location({}, action);
    assert.equal(result.href, '/dave39/text-kart/master');
    assert.equal(result.type, PATH);
    assert.equal(result.owner, 'dave39');
    assert.equal(result.repo, 'text-kart');
    assert.equal(result.branch, 'master');
    assert.notOk(result.path);
  });

  it('parses path', function() {
    let action = { type: SET_LOCATION, href: '/dave39/text-kart/master/lib/main.c' };
    const result = location({}, action);
    assert.equal(result.href, '/dave39/text-kart/master/lib/main.c');
    assert.equal(result.type, PATH);
    assert.equal(result.owner, 'dave39');
    assert.equal(result.repo, 'text-kart');
    assert.equal(result.branch, 'master');
    assert.equal(result.path, 'lib/main.c');
  });
});
