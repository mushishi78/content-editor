import React from 'react';
import { connect } from 'react-redux';
import { setLocation } from '../actions/index';

class ListViewer extends React.Component {
  render() {
    return !this.props.list ? null :
      <ul style={styles.ul}>
        {
          this.props.list.map(({ label, location, type }) => {
            return (
              <li style={styles.li} key={label}>
                <a onClick={this.props.setLocation.bind(null, location)}
                   style={styles.a}
                   href='javascript:void(0)'>
                  <i style={styles.icon} className={'octicon octicon-' + icon(type)} />
                  {label}
                </a>
              </li>
            );
          })
        }
      </ul>;
  }
}

function icon(type) {
  return { dir: 'file-directory', file: 'file-text', repo: 'repo', branch: 'git-branch' }[type];
}

const styles = {
  ul: {
    padding: '25px 0',
    margin: '0',
    background: '#16a085'
  },
  li: {
    display: 'inline-block',
    fontSize: '1.8em',
    listStyleType: 'none',
    width: '45%',
    margin: '0 2.5%',
    verticalAlign: 'top'
  },
  a: {
    color: '#ecf0f1'
  },
  icon: {
    paddingRight: '0.2em',
    fontSize: '1em'
  }
}

function mapStateToProps({ list }) {
  return { list };
}

function mapDispatchToProps(dispatch) {
  return { setLocation: (location) => { dispatch(setLocation(location)); } };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListViewer);
