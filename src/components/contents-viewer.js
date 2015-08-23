import React from 'react';
import { connect } from 'react-redux';

class ContentsViewer extends React.Component {
  order(a, b) {
    return alphabetical(a.type, b.type) || alphabetical(a.label, b.label);
  }

  render() {
    return !this.props.contents ? null :
      <ul style={styles.ul}>
        {
          this.props.contents.sort(this.order).map(({ label, location, type }) => {
            return (
              <li style={styles.li} key={label} className='two-columns'>
                <a style={styles.a} href={location}>
                  <i style={styles.icon} className={'octicon octicon-' + icon(type)} />
                  <span style={styles.span}>{label}</span>
                </a>
              </li>
            );
          })
        }
      </ul>;
  }
}

function alphabetical(a, b) {
  let lowerA = a.toLowerCase();
  let lowerB = b.toLowerCase();
  if(lowerA < lowerB) return -1;
  if(lowerA > lowerB) return 1;
  return 0
}

function icon(type) {
  return { dir: 'file-directory', file: 'file-text', repo: 'repo', branch: 'git-branch' }[type];
}

const styles = {
  ul: {
    padding: '5px 1%',
    margin: '10px 1%',
    background: '#fff',
    fontSize: '1.6em',
    borderRadius: '5px',
    boxShadow: '0 0 2px 2px rgba(0,0,0,0.5)'
  },
  li: {
    listStyleType: 'none',
    margin: '0.1em 0'
  },
  a: {
    color: '#34495E'
  },
  icon: {
    paddingRight: '0.2em',
    fontSize: '1em'
  },
  span: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: '93%'
  }
}

function mapStateToProps({ locations }) {
  return { contents: locations[locations.current] };
}

export default connect(mapStateToProps, null)(ContentsViewer);
