import React from 'react';

export default class Uploader extends React.Component {
  handleSubmit(e) { e.preventDefault(); }

  handleFile(e) {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = upload => this.props.upload(file.name, upload.target.result);
    reader.readAsBinaryString(file);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}
            encType='multipart/form-data'
            style={styles.form}>

        <label htmlFor="file">
          <i style={styles.icon}
             className='octicon octicon-cloud-upload'
             alt='upload' />
        </label>

        <input id='file'
               type='file'
               onChange={this.handleFile.bind(this)}
               style={styles.input} />
      </form>
    );
  }
}

const styles = {
  form: {
    display: 'inline-block'
  },
  input: {
    display: 'none'
  },
  icon: {
    color: '#34495E',
    paddingRight: '0.4em',
    fontSize: '1em',
    cursor: 'pointer'
  }
}