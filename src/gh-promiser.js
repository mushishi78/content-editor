import _GitHub from 'github-api';
import denodeify from 'denodeify';

export default function GHPromiser(username, password, GitHub = _GitHub) {
  let github = new GitHub({ username, password, auth: "basic" });

  return {
    listBranches: splitAndDenode(({ owner, repo }, callback) => {
      github.getRepo(owner, repo).listBranches(callback);
    }),

    contents: splitAndDenode(({ owner, repo, branch, path = '' }, callback) => {
      github.getRepo(owner, repo).contents(branch, path, callback);
    }),

    write: splitAndDenode(({ owner, repo, branch, path }, contents, comment, callback) => {
      github.getRepo(owner, repo).write(branch, path, contents, comment, callback);
    }),

    userRepos: splitAndDenode(({ owner }, callback) => {
      github.getUser().userRepos(owner, callback);
    }),

    orgRepos: splitAndDenode(({ owner }, callback) => {
      github.getUser().orgRepos(owner, callback);
    }),

    repos: denodeify(github.getUser().repos)
  }
}

function splitAndDenode(fn) {
  return denodeify((location, ...rest) => fn(splitLocation(location), ...rest));
}

function splitLocation(location) {
  const [_, owner, repo, branch, ...path] = location.split('/');
  return { owner, repo, branch, path: path.join('/') };
}
