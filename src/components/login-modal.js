import React from 'react';
import { IN_PROGRESS } from '../constants/status-types';

export default class LoginModal extends React.Component {
  submit() { this.props.login(this.state); }
  change(e) { this.setState({ [e.target.id]: e.target.value }); }
  handleKeyDown(e) { if(e.key === 'Enter') { this.submit(); } }
  render() {
    return (
      <section style={styles.section}>
        <h1 style={styles.heading}>Content Editor</h1>

        <input type='text'
               style={styles.input}
               placeholder='GitHub Personal Access Token'
               onChange={this.change.bind(this)}
               onKeyDown={this.handleKeyDown.bind(this)}
               id='accessToken'/>

        <a href='https://help.github.com/articles/creating-an-access-token-for-command-line-use//#creating-a-token'
           target='_blank'
           style={styles.a}>
          What is this?
        </a>

        <button style={{ ...styles.input, ...styles.button }}
                onClick={this.submit.bind(this)}>Login</button>

      </section>
    );
  }
}

const styles = {
  section: {
    margin: '150px auto',
    padding: '30px',
    background: '#ecf0f1',
    borderRadius: '10px',
    fontSize: '1.4em',
    width: '15em'
  },

  heading: {
    textAlign: 'center',
    margin: '0.1em',
    color: '#2c3e50'
  },

  input: {
    width: '100%',
    padding: '0.5em 0',
    marginTop: '1em',
    textAlign: 'center',
    borderRadius: '5px'
  },

  a: {
    display: 'block',
    fontSize: '0.7em',
    textAlign: 'right'
  },

  button: {
    background: '#1abc9c',
    color: '#fff'
  }
}
