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
               placeholder='GitHub Username'
               onChange={this.change.bind(this)}
               onKeyDown={this.handleKeyDown.bind(this)}
               id='username'/>

        <input type='password'
               style={styles.input}
               placeholder='GitHub Password'
               onChange={this.change.bind(this)}
               onKeyDown={this.handleKeyDown.bind(this)}
               id='password'/>

        <button style={{ ...styles.input, ...styles.button }}
                onClick={this.submit.bind(this)}>Login</button>

      </section>
    );
  }
}

const styles = {
  section: {
    position: 'absolute',
    zIndex: '2',
    margin: '20% 35%',
    padding: '2%',
    background: '#ecf0f1',
    borderRadius: '10px',
    fontSize: '1.4em'
  },

  heading: {
    textAlign: 'center',
    margin: '0.1em',
    color: '#2c3e50'
  },

  input: {
    width: '100%',
    padding: '0.5em 0',
    margin: '0.5em 0',
    textAlign: 'center',
    borderRadius: '5px'
  },

  button: {
    background: '#1abc9c',
    color: '#fff'
  }
}
