import { LOAD } from '../constants/action-types';
import { INITIATED, COMPLETED } from '../constants/status-types';
import { atob as _atob, failed, isArray } from '../utils';

export default function load(atob = _atob) {
  return (dispatch, getState) => {
    const { locations, locations: { current }, github } = getState();
    if(locations[current]) { return; }
    dispatch({ type: LOAD, status: INITIATED });
    getMethod(current)(dispatch, current, github, atob).catch(failed(dispatch, LOAD));
  }
}

function getMethod(location) {
  switch(location.split('/').length) {
    case 3:  return getBranches;
    case 2:  return getOwnersRepos;
    default: return getContents;
  }
}

function getContents(dispatch, location, github, atob) {
  return github.contents(location).then(contents => {
    isArray(contents) ?
      setContents(dispatch, parseFolder(location))(contents) :
      setFile(dispatch, contents, atob);
  });
}

function getBranches(dispatch, location, github) {
  return github.listBranches(location).then(setContents(dispatch, parseBranch(location)));
}

function getOwnersRepos(dispatch, location, github) {
  return github.userRepos(location).then(repos => {
    return repos.length === 0 ? github.orgRepos(location) : repos;
  }).then(setContents(dispatch, parseOwnerRepo));
}

function setContents(dispatch, parse) {
  return contents => dispatch({ type: LOAD, status: COMPLETED, contents: contents.map(parse) });
}

function setFile(dispatch, { content }, atob) {
  dispatch({ type: LOAD, status: COMPLETED, file: { text: atob(content) } });
}

function parseBranch(location) {
  return branch => ({ label: branch, location: location + '/' + branch, type: 'branch' });
}

function parseFolder(location) {
  return ({ name, type }) => ({ label: name, location: location + '/' + name, type });
}

function parseOwnerRepo({ name, full_name }) {
  return { label: name, location: '/' + full_name, type: 'repo' };
}
