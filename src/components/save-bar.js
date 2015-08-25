import React from 'react';
import { connect } from 'react-redux';
import { save } from '../actions/index';

let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

class SaveBar extends React.Component {
  render() {
    return (
      <ReactCSSTransitionGroup transitionName='save-bar'>
      {
        !this.props.file || !this.props.file.changed ? null :
          <button style={styles.button} onClick={this.props.save} className='save-bar' key='save-bar'>
            Save
          </button>
      }
      </ReactCSSTransitionGroup>
    );
  }
}

const styles = {
  button: {
    position: 'relative',
    background: '#2ecc71',
    fontSize: '2em',
    width: '100%',
    padding: '15px 0',
    boxShadow: '0 0 5px 2px #10582F',
    transition: 'all .3s ease-in',
    color: '#fff'
  }
}

function mapStateToProps({ file }) {
  return { file };
}

function mapDispatchToProps(dispatch) {
  return {
    save: () => dispatch(save())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveBar);
