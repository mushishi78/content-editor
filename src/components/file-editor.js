import React from 'react';
import { connect } from 'react-redux';
import { setText } from '../actions/index';

class FileEditor extends React.Component {
  setText(e) { this.props.setText(e.target.value); }
  autoGrow() {
    let fileEditor = React.findDOMNode(this.refs.fileEditor);
    if(fileEditor) {
      fileEditor.style.height = "5px";
      fileEditor.style.height = (fileEditor.scrollHeight)+"px";
    }
  }
  componentDidMount() { this.autoGrow(); }
  componentDidUpdate() { this.autoGrow(); }
  render() {
    return !this.props.file ? null :
      <div>
        <textarea style={styles.textarea}
                  defaultValue={this.props.file.text}
                  onChange={this.setText.bind(this)}
                  disabled={!this.props.permissions.write}
                  ref='fileEditor' />
      </div>;
  }
}

const styles = {
  textarea: {
    margin: '10px 1% 100px',
    border: 'none',
    color: '#333',
    padding: '5px 2%',
    width: '94%',
    borderRadius: '10px',
    fontSize: '1.3em',
    boxShadow: '0 0 2px 2px rgba(0,0,0,0.5)',
    fontFamily: "'Ubuntu', sans-serif"
  }
}

function mapStateToProps({ file, permissions }) {
  return { file, permissions };
}

function mapDispatchToProps(dispatch) {
  return { setText: text => dispatch(setText(text)) };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileEditor);
