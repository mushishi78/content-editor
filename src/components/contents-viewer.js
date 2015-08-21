import React from 'react';
import { connect } from 'react-redux';

class ContentsViewer extends React.Component {
  render() {
    return !this.props.contents ? null :
      <ul style={styles.ul}>
        {
          this.props.contents.map(({ label, location, type }) => {
            return (
              <li style={styles.li} key={label}>
                <a style={styles.a} href={location}>
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

function mapStateToProps({ locations }) {
  return { contents: locations[locations.current] };
}

export default connect(mapStateToProps, null)(ContentsViewer);
