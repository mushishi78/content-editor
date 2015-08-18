import _GitHub from 'github-api';
import denodeify from 'denodeify';

export default function GHPromiser(username, password, GitHub = _GitHub) {
  let github = new GitHub({ username, password, auth: "basic" });

  return {
    listBranches: denodeify(({ owner, repo }, callback) => {
      github.getRepo(owner, repo).listBranches(callback);
    }),

    contents: denodeify(({ owner, repo, branch, path = '' }, callback) => {
      github.getRepo(owner, repo).contents(branch, path, callback);
    }),

    write: denodeify(({ owner, repo, branch, path }, contents, comment, callback) => {
      github.getRepo(owner, repo).write(branch, path, contents, comment, callback);
    }),

    userRepos: denodeify(({ owner }, callback) => {
      github.getUser().userRepos(owner, callback);
    }),

    orgRepos: denodeify(({ owner }, callback) => {
      github.getUser().orgRepos(owner, callback);
    }),

    repos: denodeify(github.getUser().repos)
  }
}
