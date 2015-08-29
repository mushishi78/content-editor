import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { logout } from '../actions/index';

class TopBar extends React.Component {
  render() {
    return !this.props.loggedIn ? null :
      <header style={styles.header}>
        {this.logout()}
        {this.home()}
        {this.breadcrumbs()}
      </header>
  }

  logout() {
    return(
      <a onClick={this.props.logout.bind(this, undefined)} href='javascript:void(0)' style={styles.logout}>
        <i style={styles.icon} className='octicon octicon-log-out' />
      </a>
    );
  }

  home() {
    return (
      <a href='/' style={styles.a}>
        <i style={styles.icon} className='octicon octicon-home' />
      </a>
    );
  }

  breadcrumbs() {
    return this.props.href.split('/').map((label, i, array) => {
      return !label ? null :
        <span style={styles.breadcrumb} key={i}>
          <a href={array.slice(0, i + 1).join('/')} style={styles.a}>{label}</a>
          { i < array.length - 1 ? '/' : '' }
        </span>
    })
  }
}

const styles = {
  header: {
    background: '#fff',
    fontSize: '1.5em',
    padding: '0.3em',
    boxShadow: '0 1px 1px 1px rgba(0,0,0,0.5)'
  },

  a: {
    color: '#2980b9',
    padding: '0 0.2em'
  },

  breadcrumb: {
    display: 'inline-block'
  },

  icon: {
    fontSize: '1em',
    color: '#34495e',
    padding: '0.05em 0.2em'
  },

  logout: {
    float: 'right'
  }
}

function mapStateToProps({ loggedIn, location: { href } }) {
  return { loggedIn, href };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
