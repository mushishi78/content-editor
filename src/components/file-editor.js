import React from 'react';
import { setSelection } from '../utils';
import { INCREMENT, DECREMENT } from '../constants/directions';

export default class FileEditor extends React.Component {
  setText(e) { this.props.setText(e.target.value); }

  getFileEditor() {
    return React.findDOMNode(this.refs.fileEditor);
  }

  setHeight(fileEditor) {
    const changeHeight = () => {
      const scrollTop = document.documentElement.scrollTop;
      fileEditor.style.height = "5px";
      fileEditor.style.height = (fileEditor.scrollHeight) + "px";
      document.documentElement.scrollTop = scrollTop;
    };
    if(fileEditor.style.height) { changeHeight(); }
    else { setTimeout(changeHeight, 150); }
  }

  setCursor(fileEditor) {
    setSelection(fileEditor, fileEditor.value.length);
  }

  setWidth(fileEditor, change) {
    let width = parseInt(fileEditor.style.width.match(/\d+/));
    width = Math.max(Math.min(width + change, 85), 25);
    fileEditor.style.width = (width + change) + "%";
    this.setHeight(fileEditor);
  }

  componentDidMount() {
    const fileEditor = this.getFileEditor();

    if(fileEditor) {
      this.setHeight(fileEditor);
      this.setCursor(fileEditor);
    }
  }

  componentDidUpdate(prevProps) {
    const fileEditor = this.getFileEditor();

    if(fileEditor) {
      this.setHeight(fileEditor);
      if(!prevProps.file) { this.setCursor(fileEditor); }
    }
  }

  textareaStyle() {
    return {
      ...styles.textarea,
      width: this.props.editorWidth + '%',
      marginBottom: this.props.file.changed ? '100px' : '0px'
    }
  }

  render() {
    return !this.props.file ? null :
      <div style={styles.div}>
        <nav style={styles.nav}>
          <i onClick={this.props.changeEditorWidth.bind(this, DECREMENT)}
             className={icons.narrow}
             style={styles.icon} />
          <i onClick={this.props.changeEditorWidth.bind(this, INCREMENT)}
             className={icons.wide}
             style={styles.icon} />
        </nav>
        <textarea style={this.textareaStyle()}
                  value={this.props.file.text}
                  onChange={this.setText.bind(this)}
                  disabled={!this.props.permissions.write}
                  ref='fileEditor' />
      </div>;
  }
}


const icons = {
  narrow: 'octicon octicon-dash',
  wide: 'octicon octicon-plus'
}

const styles = {
  div: {
    textAlign: 'center'
  },
  nav: {
    textAlign: 'right',
    padding: '0 1%'
  },
  icon: {
    fontSize: '1.5em',
    margin: '0.3em',
    color: '#C1E6FF',
    cursor: 'pointer'
  },
  textarea: {
    margin: '0 auto',
    border: 'none',
    color: '#333',
    padding: '5px 2%',
    borderRadius: '10px',
    fontSize: '1.3em',
    boxShadow: '0 0 2px 2px rgba(0,0,0,0.5)',
    fontFamily: "'Ubuntu', sans-serif"
  }
}
