import { LOAD } from '../constants/action-types';
import { INITIATED, COMPLETED } from '../constants/status-types';
import { atob as _atob } from '../atob';
import failed from '../failed';

export default function load(atob = _atob) {
  return (dispatch, getState) => {
    const { location, github, repos } = getState();
    dispatch({ type: LOAD, status: INITIATED });
    getMethod(location)(dispatch, location, github, repos, atob).catch(failed(dispatch, LOAD));
  }
}

function getMethod(location) {
  if(location.verb)   { return createFile; }
  if(location.branch) { return getContents; }
  if(location.repo)   { return getBranches; }
  if(location.owner)  { return getOwnersRepos; }
  return getRepos;
}

function createFile(dispatch, { path }) {
  dispatch({ type: LOAD, status: COMPLETED, file: { name: toName(path) } });
  return ignoreCatch();
}

function getContents(dispatch, location, github, _, atob) {
  return github.contents(location).then(contents => {
    Array.isArray(contents) ?
      setList(dispatch, parseFolder)(contents) :
      setFile(dispatch, contents, atob);
  });
}

function getBranches(dispatch, location, github) {
  return github.listBranches(location).then(setList(dispatch, parseBranch));
}

function getOwnersRepos(dispatch, location, github) {
  return github.userRepos(location).then(repos => {
    return repos.length === 0 ? github.orgRepos(location) : repos;
  }).then(setList(dispatch, parseOwnerRepo));
}

function getRepos(dispatch, location, github, repos) {
  dispatch({ type: LOAD, status: COMPLETED, list: repos });
  return ignoreCatch();
}

function setList(dispatch, parse) {
  return list => { dispatch({ type: LOAD, status: COMPLETED, list: list.map(parse) }); }
}

function setFile(dispatch, { name, content }, atob) {
  dispatch({ type: LOAD, status: COMPLETED, file: { name, content: atob(content) } });
}

function parseBranch(branch) {
  return { label: branch, location: { branch: branch}, type: 'branch' };
}

function parseFolder({ name, path, type }) {
  return { label: name, location: { path }, type };
}

function parseOwnerRepo({ name, owner: { login } }) {
  return { label: name, location: { owner: login, repo: name }, type: 'repo' };
}

function toName(path = '') {
  return path.split('/').slice(-1)[0];
}

function ignoreCatch() {
  return { "catch": () => {} };
}