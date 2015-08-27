import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createPrompt, movePrompt } from '../actions/index';
import { CREATE, MOVE, REMOVE } from '../constants/action-types';
import { PATH } from '../constants/location-types';

class ContentsViewer extends React.Component {
  order(a, b) {
    return alphabetical(a.type, b.type) || alphabetical(a.label, b.label);
  }

  render() {
    return !this.props.contents ? null :
      <section style={styles.section}>
        <ul style={styles.ul}>
          {
            this.props.contents.sort(this.order).map(({ label, href, type }) => {
              return (
                <li style={styles.li} key={label} className='two-columns'>
                  <a style={styles.a} href={href}>
                    <i style={styles.icon} className={'octicon octicon-' + icon(type)} />
                    {label}
                  </a>
                  {
                    type !== 'file' && type !== 'dir' ? null :
                      <span style={styles.actions} className='contents-actions'>
                        <i style={styles.icon}
                           className='octicon octicon-pencil'
                           onClick={this.props.movePrompt.bind(null, href)} />

                        <i style={styles.icon}
                           className='octicon octicon-trashcan' />

                      </span>
                  }
                </li>
              );
            })
          }
        </ul>
        {
          !this.props.canCreate ? null :
            <nav style={styles.nav}>
              <i style={styles.icon}
                 className='octicon octicon-plus'
                 onClick={this.props.createPrompt} />
            </nav>
        }
      </section>;
  }
}

function alphabetical(a, b) {
  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();
  if(lowerA < lowerB) return -1;
  if(lowerA > lowerB) return 1;
  return 0
}

function icon(type) {
  return { dir: 'file-directory', file: 'file-text', repo: 'repo', branch: 'git-branch' }[type];
}

const styles = {
  section: {
    padding: '5px 1%',
    margin: '10px 1%',
    background: '#fff',
    fontSize: '1.6em',
    borderRadius: '5px',
    boxShadow: '0 0 2px 2px rgba(0,0,0,0.5)'
  },
  nav: {
    display: 'inline-block',
    width: '10%',
    verticalAlign: 'top',
    textAlign: 'right'
  },
  ul: {
    display: 'inline-block',
    width: '90%',
    margin: '0',
    padding: '0'
  },
  li: {
    listStyleType: 'none',
    margin: '0.1em 0'
  },
  a: {
    color: '#34495E',
    verticalAlign: 'middle'
  },
  icon: {
    color: '#34495E',
    paddingRight: '0.2em',
    fontSize: '1em',
    cursor: 'pointer'
  },
  actions: {
    marginLeft: '0.5em',
    fontSize: '0.8em',
    transition: 'all .1s ease-in'
  }
}

function mapStateToProps({ contents, location, permissions }) {
  return {
    contents: contents[location.href],
    permissions,
    canCreate: location.type === PATH && permissions.write
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createPrompt, movePrompt }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentsViewer);
