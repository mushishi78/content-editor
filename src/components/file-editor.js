import React from 'react';
import { setSelection } from '../utils';

export default class FileEditor extends React.Component {
  setText(e) { this.props.setText(e.target.value); }

  refreshFileEditor(prevProps = {}) {
    const fileEditor = React.findDOMNode(this.refs.fileEditor);

    if(fileEditor) {
      fileEditor.style.height = "5px";
      fileEditor.style.height = (fileEditor.scrollHeight + 25) + "px";

      if(!prevProps.file) {
        setSelection(fileEditor, fileEditor.value.length);
      }
    }
  }

  componentDidMount()           { this.refreshFileEditor(); }
  componentDidUpdate(prevProps) { this.refreshFileEditor(prevProps); }

  render() {
    return !this.props.file ? null :
      <div>
        <textarea style={styles.textarea}
                  value={this.props.file.text}
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
