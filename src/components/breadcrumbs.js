import React from 'react';
import { connect } from 'react-redux';
import { setLocation } from '../actions/index';

class Breadcrumbs extends React.Component {
  pathMap(path, callback) {
    return (path || '').split('/').map((section, i, sections) => {
      return callback(section, sections.slice(0, i + 1).join('/'), i);
    });
  }

  render() {
    const { owner, repo, branch, path } = this.props.location;

    return (
      <nav style={styles.nav}>
        {this.link(<i style={styles.icon} className='octicon octicon-home' />, {})}
        {
          !owner ? null :
            <span style={styles.span}>
              <i style={styles.icon} className='octicon octicon-repo' />
              {this.link(owner, { owner })}/{this.link(repo, { repo })}
            </span>
        }

        {
          !branch ? null :
            <span style={styles.span}>
              <i style={styles.icon} className='octicon octicon-git-branch' />
              {this.link(branch, { branch })}
            </span>
        }

        {
          !path ? null :
          <span style={styles.span}>
            <i style={styles.icon} className='octicon octicon-file-directory' />
            {
              this.pathMap(path || '', (label, subPath, i) => {
                return <span>
                        {this.link(label, { path: subPath })}
                        {subPath == path ? null : '/'}
                       </span>;
              })
            }
          </span>
        }
      </nav>
    );
  }

  link(label, location) {
    return <a onClick={this.props.setLocation.bind(null, location)}
              style={styles.a}
              href='javascript:void(0)'>{label}</a>;
  }
}

const styles = {
  nav: {
    color: '#7f8c8d',
    fontSize: '2em',
    width: '85%'
  },

  span: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },

  a: {
    color: '#2980b9',
    padding: '0 0.1em'
  },

  icon: {
    padding: '0.1em 0.1em 0 0.5em',
    fontSize: '1em',
    color: '#34495e'
  }
}

function mapStateToProps({ location }) {
  return { location };
}

function mapDispatchToProps(dispatch) {
  return { setLocation: (location) => { dispatch(setLocation(location)); } };
}

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
