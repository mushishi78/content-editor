import { assert } from 'chai';
import sinon from 'sinon';
import permissions from '../../src/reducers/permissions';
import { LOGIN, LOGOUT, SET_LOCATION } from '../../src/constants/action-types';
import { IN_PROGRESS, COMPLETED, FAILED } from '../../src/constants/status-types';

describe('permissions', function() {
  const repos = [
    { label: 'NeoDude/Lazerly', href: '/NeoDude/Lazerly', type: 'repo' },
    { label: 'NeoDude/JzzT', href: '/NeoDude/JzzT', type: 'repo' }
  ];

  describe('LOGIN', function() {
    it("caches user's repos and denies write permission if location not set", function() {
      let state = { repos: [] };
      let action = { type: LOGIN, status: COMPLETED, repos };
      let expected = { repos: ['/NeoDude/Lazerly', '/NeoDude/JzzT'], write: false };
      assert.deepEqual(permissions(state, action), expected);
    });

    it("caches user's repos and grants write permission if user's repo", function() {
      let state = { repo: '/NeoDude/Lazerly', repos: [] };
      let action = { type: LOGIN, status: COMPLETED, repos };
      let expected = {
        repo: '/NeoDude/Lazerly',
        repos: ['/NeoDude/Lazerly', '/NeoDude/JzzT'],
        write: true
      };
      assert.deepEqual(permissions(state, action), expected);
    });

    it("caches user's repos and denies write permission if not user's repo", function() {
      let state = { repo: '/shck-plc/fizl', repos: [] };
      let action = { type: LOGIN, status: COMPLETED, repos };
      let expected = {
        repo: '/shck-plc/fizl',
        repos: ['/NeoDude/Lazerly', '/NeoDude/JzzT'],
        write: false
      };
      assert.deepEqual(permissions(state, action), expected);
    });

    it("doesn't explode if login failed", function() {
      let state = { repo: '/NeoDude/Lazerly', repos: [] };
      let action = { type: LOGIN, status: FAILED, flash: 'Not Authorized' };
      let expected = { repo: '/NeoDude/Lazerly', repos: [], write: false };
      assert.deepEqual(permissions(state, action), expected);
    });
  })

  it("forgets cached repos on logout and denies write permission", function() {
    let state = {
      repo: '/NeoDude/Lazerly',
      repos: ['/NeoDude/Lazerly', '/NeoDude/JzzT'],
      write: true
    };
    let action = { type: LOGOUT };
    let expected = { repo: '/NeoDude/Lazerly', write: false };
    assert.deepEqual(permissions(state, action), expected);
  });

  describe('SET_LOCATION', function() {
    it("extracts repo from location and grants write permission if user's repo", function() {
      let state = { repos: ['/NeoDude/Lazerly', '/NeoDude/JzzT'], write: false };
      let action = { type: SET_LOCATION, href: '/NeoDude/Lazerly/master/app.rb' };
      let expected = {
        repo: '/NeoDude/Lazerly',
        repos: ['/NeoDude/Lazerly', '/NeoDude/JzzT'],
        write: true
      };

      assert.deepEqual(permissions(state, action), expected);
    });

    it("extracts repo from location and denies write permission if not user's repo", function() {
      let state = { repos: ['/NeoDude/Lazerly', '/NeoDude/JzzT'], write: false };
      let action = { type: SET_LOCATION, href: '/shck-plc/fizl/gh-pages/assets' };
      let expected = {
        repo: '/shck-plc/fizl',
        repos: ['/NeoDude/Lazerly', '/NeoDude/JzzT'],
        write: false
      };

      assert.deepEqual(permissions(state, action), expected);
    });

    it("extracts repo from location and denies write permission if repos not loaded", function() {
      let state = { repos: [] };
      let action = { type: SET_LOCATION, href: '/NeoDude/Lazerly/master/app.rb' };
      let expected = { repo: '/NeoDude/Lazerly', repos: [], write: false };
      assert.deepEqual(permissions(state, action), expected);
    });
  });
});
