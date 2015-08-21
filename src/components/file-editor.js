import React from 'react';
import { connect } from 'react-redux';
import { save, setText } from '../actions/index';

class FileEditor extends React.Component {
  setText(e) { this.props.setText(e.target.value); }
  setComment(e) { this.setState({ comment: e.target.value }); }
  save() { this.props.save(this.state && this.state.comment); }
  render() {
    return !this.props.file ? null :
      <div>
        <header style={styles.header}>
          {this.props.file.name}
        </header>

        <textarea style={this.textStyles()}
                  defaultValue={this.props.file.text}
                  onChange={this.setText.bind(this)}
                  disabled={!this.props.permissions.write} />
        {
          !this.props.permissions.write ? null :
            <span>
              <textarea style={styles.comment}
                        placeholder='Describe the changes you have made...'
                        onChange={this.setComment.bind(this)} />

              <button style={styles.button}
                      onClick={this.save.bind(this)}>
                Commit Changes
              </button>
            </span>
        }
      </div>;
  }

  textStyles() {
    return {
      width: '90%',
      margin: '20px 2.5% 5px',
      height: this.props.permissions.write ? '24em' : '29.5em',
      border: '#34495E',
      padding: '2.5%',
      fontSize: '1.3em',
      fontFamily: 'Roboto Mono',
      color: '#333'
    };
  }
}

const styles = {
  header: {
    padding: '0.5em',
    background: '#16a085',
    color: '#fff',
    fontSize: '2em'
  },
  comment: {
    width: '90%',
    margin: '5px 2.5%',
    border: '#34495E',
    padding: '2.5%',
    fontSize: '1.2em',
    color: '#333',
    fontFamily: 'sans-serif'
  },
  button: {
    background: '#16A085',
    fontSize: '2em',
    width: '95%',
    margin: '5px 2.5% 10px'
  }
}

function mapStateToProps({ file, permissions }) {
  return { file, permissions };
}

function mapDispatchToProps(dispatch) {
  return {
    setText: text => { dispatch(setText(text)); },
    save: comment => { dispatch(save(comment)); }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileEditor);
