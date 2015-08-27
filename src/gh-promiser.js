import _GitHub from 'github-api';
import denodeify from 'denodeify';

export default function GHPromiser(username, password, GitHub = _GitHub) {
  const github = new GitHub({ username, password, auth: "basic" });

  return {
    contents: denodeify(({ owner, repo, branch, path = '' }, callback) => {
      github.getRepo(owner, repo).contents(branch, path, callback);
    }),

    listBranches: denodeify(({ owner, repo }, callback) => {
      github.getRepo(owner, repo).listBranches(callback);
    }),

    move: denodeify(({ owner, repo, branch }, oldPath, newPath, callback) => {
      github.getRepo(owner, repo).move(branch, oldPath, newPath, callback);
    }),

    orgRepos: denodeify(({ owner }, callback) => {
      github.getUser().orgRepos(owner, callback);
    }),

    remove: denodeify(({ owner, repo, branch }, path, callback) => {
      github.getRepo(owner, repo).remove(branch, path, callback);
    }),

    repos: denodeify(github.getUser().repos),

    userRepos: denodeify(({ owner }, callback) => {
      github.getUser().userRepos(owner, callback);
    }),

    write: denodeify(({ owner, repo, branch, path }, contents, comment, callback) => {
      github.getRepo(owner, repo).write(branch, path, contents, comment, callback);
    })
  }
}
