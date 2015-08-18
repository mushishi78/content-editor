import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/index';

class LogoutButton extends React.Component {
  render() {
    return !this.props.loggedIn ? null :
      <a onClick={this.props.logout} style={styles.a} href='javascript:void(0)'>
        <i style={styles.icon} className='octicon octicon-log-out' />Log Out
      </a>;
  }
}

const styles = {
  a: {
    color: '#2980b9',
    margin: '0.1em 0.4em',
    float: 'right',
    fontSize: '1.5em'
  },

  icon: {
    fontSize: '1.4em',
    verticalAlign: 'middle',
    padding: '0.1em',
    color: '#34495e'
  }
}

function mapStateToProps({ loggedIn }) {
  return { loggedIn };
}

function mapDispatchToProps(dispatch) {
  return { logout: () => { dispatch(logout()); } };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton);
