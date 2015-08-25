import { LOAD } from '../constants/action-types';
import { IN_PROGRESS, COMPLETED } from '../constants/status-types';
import { OWNER, REPO, PATH } from '../constants/location-types';
import { atob as _atob, failed, isArray } from '../utils';

export default function load(atob = _atob) {
  return (dispatch, getState) => {
    const { location, contents, github } = getState();
    if(contents[location.href]) { return; }
    dispatch({ type: LOAD, status: IN_PROGRESS });
    getMethod(location)(dispatch, location, github, atob).catch(failed(dispatch, LOAD));
  }
}

function getMethod(location) {
  switch(location.type) {
    case REPO: return getBranches;
    case OWNER: return getOwnersRepos;
    case PATH: return getContents;
  }
}

function getContents(dispatch, location, github, atob) {
  return github.contents(location).then(contents => {
    isArray(contents) ?
      setContents(dispatch, location, parseFolder(location))(contents) :
      setFile(dispatch, contents, atob);
  });
}

function getBranches(dispatch, location, github) {
  return github.listBranches(location)
    .then(setContents(dispatch, location, parseBranch(location)));
}

function getOwnersRepos(dispatch, location, github) {
  return github.userRepos(location).then(repos => {
    return repos.length === 0 ? github.orgRepos(location) : repos;
  }).then(setContents(dispatch, location, parseOwnerRepo));
}

function setContents(dispatch, location, parse) {
  return contents => dispatch({
    type: LOAD,
    status: COMPLETED,
    location,
    contents: contents.map(parse)
  });
}

function setFile(dispatch, { content }, atob) {
  dispatch({ type: LOAD, status: COMPLETED, file: { text: atob(content) } });
}

function parseBranch(location) {
  return branch => ({ label: branch, href: location.href + '/' + branch, type: 'branch' });
}

function parseFolder(location) {
  return ({ name, type }) => ({ label: name, href: location.href + '/' + name, type });
}

function parseOwnerRepo({ name, full_name }) {
  return { label: name, href: '/' + full_name, type: 'repo' };
}
