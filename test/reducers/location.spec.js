import { assert } from 'chai';
import sinon from 'sinon';
import location from '../../src/reducers/location';
import { SET_LOCATION, CREATE } from '../../src/constants/action-types';
import { OWNER, REPO, PATH } from '../../src/constants/location-types';

describe('location', function() {
  describe('SET_LOCATION', function() {
    it('parses root', function() {
      const action = { type: SET_LOCATION, href: '/' };
      const result = location({}, action);
      assert.equal(result.href, '/');
      assert.equal(result.type, OWNER);
      assert.notOk(result.owner || result.repo || result.branch || result.path);
    });

    it('parses owner', function() {
      const action = { type: SET_LOCATION, href: '/dave39' };
      const result = location({}, action);
      assert.equal(result.href, '/dave39');
      assert.equal(result.type, OWNER);
      assert.equal(result.owner, 'dave39');
      assert.notOk(result.repo || result.branch || result.path);
    });

    it('parses repo', function() {
      const action = { type: SET_LOCATION, href: '/dave39/text-kart' };
      const result = location({}, action);
      assert.equal(result.href, '/dave39/text-kart');
      assert.equal(result.type, REPO);
      assert.equal(result.owner, 'dave39');
      assert.equal(result.repo, 'text-kart');
      assert.notOk(result.branch || result.path);
    });

    it('parses branch', function() {
      const action = { type: SET_LOCATION, href: '/dave39/text-kart/master' };
      const result = location({}, action);
      assert.equal(result.href, '/dave39/text-kart/master');
      assert.equal(result.type, PATH);
      assert.equal(result.owner, 'dave39');
      assert.equal(result.repo, 'text-kart');
      assert.equal(result.branch, 'master');
      assert.notOk(result.path);
    });

    it('parses path', function() {
      const action = { type: SET_LOCATION, href: '/dave39/text-kart/master/lib/main.c' };
      const result = location({}, action);
      assert.equal(result.href, '/dave39/text-kart/master/lib/main.c');
      assert.equal(result.type, PATH);
      assert.equal(result.owner, 'dave39');
      assert.equal(result.repo, 'text-kart');
      assert.equal(result.branch, 'master');
      assert.equal(result.path, 'lib/main.c');
    });
  });

  describe('CREATE', function() {
    it('extends path to new file location', function() {
      const state = {
        href: '/dave39/text-kart/master/lib',
        type: PATH,
        owner: 'dave39',
        repo: 'text-kart',
        branch: 'master',
        path: 'lib'
      }
      const result = location(state, { type: CREATE, path: 'lib/routes.c' });
      assert.equal(result.href, '/dave39/text-kart/master/lib/routes.c');
      assert.equal(result.type, PATH);
      assert.equal(result.owner, 'dave39');
      assert.equal(result.repo, 'text-kart');
      assert.equal(result.branch, 'master');
      assert.equal(result.path, 'lib/routes.c');
    });
  });
});
