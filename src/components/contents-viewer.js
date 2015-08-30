import React from 'react';
import { CREATE, MOVE, REMOVE } from '../constants/action-types';
import { PATH } from '../constants/location-types';
import { alphabetical } from '../utils';
import Uploader from './uploader';

export default class ContentsViewer extends React.Component {
  parseContents() {
    const parent = this.props.location.href === '/' ? '' : this.props.location.href;
    const pattern = new RegExp(parent + '\\/[^\\/]+$');
    let parsed = [];

    for(let href in this.props.contents) {
      if(href.search(pattern) === 0) {
        const label = href.match(/[^\/]+$/)[0];
        parsed.push({ label, href, type: this.props.contents[href] });
      }
    }

    return parsed[0] ? parsed.sort(this.order.bind(this)) : null;
  }

  order(a, b) {
    return alphabetical(a.type, b.type) || alphabetical(a.label, b.label);
  }

  render() {
    const contents = this.parseContents();
    const canCreate = this.props.location.type === PATH && this.props.permissions.write;

    return !contents ? null :
      <section style={styles.section}>
        <ul style={styles.ul}>
          {
            contents.map(({ label, href, type }) => {
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
          !canCreate ? null :
            <nav style={styles.nav}>
              <Uploader upload={this.props.upload} />
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
    width: '15%',
    verticalAlign: 'top',
    textAlign: 'right'
  },
  ul: {
    display: 'inline-block',
    width: '85%',
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