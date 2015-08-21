import React from 'react';
import { connect } from 'react-redux';

class Breadcrumbs extends React.Component {
  render() {
    const links = this.links();

    return (
      <nav style={styles.nav}>
        <a href='/' style={styles.a}>
          <i style={styles.icon} className='octicon octicon-home' />
        </a>
        {this.section(links.slice(1, 3), 'repo')}
        {this.section(links.slice(3, 4), 'git-branch')}
        {this.section(links.slice(4, links.length), 'file-directory')}
      </nav>
    );
  }

  links() {
    return this.props.location.split('/').map((label, i, array) => {
      return !label ? null :
        <a href={array.slice(0, i + 1).join('/')} style={styles.a}>{label}</a>;
    });
  }

  section(links, icon) {
    return !links[0] ? null :
      <span style={styles.span}>
        <i style={styles.icon} className={'octicon octicon-' + icon} />
        {links.map((link, i) => <span>{link}{ i < links.length - 1 ? '/' : '' }</span>)}
      </span>;
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

function mapStateToProps({ locations: { current } }) {
  return { location: current };
}

export default connect(mapStateToProps, null)(Breadcrumbs);
