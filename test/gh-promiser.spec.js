import { assert } from 'chai';
import sinon from 'sinon';
import GHPromiser from '../src/gh-promiser';

describe('GHPromiser', function() {
  const username = 'FrnkY89',
        password = 'LemonPops';

  beforeEach(function() {
    this.repo = {};
    this.user = { repos: (callback) => callback(null, 'repos') };
    this.github = {
      getRepo: sinon.stub().withArgs('NeoDude', 'Lazerly').returns(this.repo),
      getUser: () => (this.user)
    };
    this.GitHubAPI = sinon.stub().withArgs(username, password).returns(this.github);
  });

  it('parses locations and wraps promise around listBranches', function(done) {
    this.repo.listBranches = sinon.stub().callsArgWith(0, null, 'branches');

    GHPromiser(username, password, this.GitHubAPI).listBranches('/NeoDude/Lazerly')
      .then((branches) => {
        assert.equal(branches, 'branches');
        done();
      });
  });

  it('parses locations and wraps promise around contents', function(done) {
    this.repo.contents = sinon.stub().callsArgWith(2, null, 'contents');

    GHPromiser(username, password, this.GitHubAPI).contents('/NeoDude/Lazerly/master/lib/app.rb')
      .then((contents) => {
        assert.equal(this.repo.contents.args[0][0], 'master');
        assert.equal(this.repo.contents.args[0][1], 'lib/app.rb');
        assert.equal(contents, 'contents');
        done();
      })
  });

  it('parses locations and wraps promise around write', function(done) {
    this.repo.write = sinon.stub().callsArgWith(4, null);

    GHPromiser(username, password, this.GitHubAPI)
      .write('/NeoDude/Lazerly/master/app.rb', 'puts "Yo world!"\n', 'Typo correction')
      .then(() => {
        assert.equal(this.repo.write.args[0][0], 'master');
        assert.equal(this.repo.write.args[0][1], 'app.rb');
        assert.equal(this.repo.write.args[0][2], 'puts "Yo world!"\n');
        assert.equal(this.repo.write.args[0][3], 'Typo correction');
        done();
      });
  });

  it('parses locations and wraps promise around userRepos', function(done) {
    this.user.userRepos = sinon.stub().callsArgWith(1, null, 'userRepos');

    GHPromiser(username, password, this.GitHubAPI).userRepos('/NeoDude')
      .then((userRepos) => {
        assert.equal(this.user.userRepos.args[0][0], 'NeoDude');
        assert.equal(userRepos, 'userRepos');
        done();
      });
  });

  it('parses locations and wraps promise around orgRepos', function(done) {
    this.user.orgRepos = sinon.stub().callsArgWith(1, null, 'orgRepos');

    GHPromiser(username, password, this.GitHubAPI).orgRepos('/shck-plc')
      .then((orgRepos) => {
        assert.equal(this.user.orgRepos.args[0][0], 'shck-plc');
        assert.equal(orgRepos, 'orgRepos');
        done();
      });
  });

  it('wraps promise around repos', function(done) {
    GHPromiser(username, password, this.GitHubAPI).repos()
      .then((repos) => {
        assert.equal(repos, 'repos');
        done();
      })
  });
});
