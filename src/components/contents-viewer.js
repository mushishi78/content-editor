import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createPrompt, movePrompt, removeConfirm } from '../actions/index';
import { CREATE, MOVE, REMOVE } from '../constants/action-types';
import { PATH } from '../constants/location-types';

class ContentsViewer extends React.Component {
  render() {
    return !this.props.contents ? null :
      <section style={styles.section}>
        <ul style={styles.ul}>
          {
            this.props.contents.map(({ label, href, type }) => {
              return (
                <li style={styles.li} key={label} className='two-columns'>
                  <a style={styles.a} href={href}>
                    <i style={styles.icon} className={icons[type]} />
                    {label}
                  </a>
                  {
                    type !== 'file' ? null :
                      <span style={styles.actions} className='contents-actions'>
                        <i style={styles.icon}
                           className={icons.move}
                           onClick={this.props.movePrompt.bind(null, href)} />

                        <i style={styles.icon}
                           className={icons.remove}
                           onClick={this.props.removeConfirm.bind(null, href)} />
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
                 className={icons.create}
                 onClick={this.props.createPrompt} />
            </nav>
        }
      </section>;
  }
}

const icons = {
  owner:  'octicon octicon-person',
  repo:   'octicon octicon-repo',
  branch: 'octicon octicon-git-branch',
  dir:    'octicon octicon-file-directory',
  file:   'octicon octicon-file-text',
  create: 'octicon octicon-plus',
  move:   'octicon octicon-pencil',
  remove: 'octicon octicon-trashcan'
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

function parseContents(contents, location, parsed = []) {
  const parent = location.href === '/' ? '' : location.href;
  const pattern = new RegExp(parent + '\\/[^\\/]+$');

  for(let href in contents) {
    if(href.search(pattern) === 0) {
      const label = href.match(/[^\/]+$/)[0];
      parsed.push({ label, href, type: contents[href] });
    }
  }

  return parsed[0] ? parsed.sort(order) : null;
}

function order(a, b) {
  return alphabetical(a.type, b.type) || alphabetical(a.label, b.label);
}

function alphabetical(a, b) {
  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();
  if(lowerA < lowerB) return -1;
  if(lowerA > lowerB) return 1;
  return 0
}

function mapStateToProps({ contents, location, permissions }) {
  return {
    contents: parseContents(contents, location),
    permissions,
    canCreate: location.type === PATH && permissions.write
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createPrompt, movePrompt, removeConfirm }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentsViewer);
