import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { blur, remove } from '../actions/index';
import { REMOVE } from '../constants/action-types';
import { setSelectionRange } from '../utils';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

class Confirm extends React.Component {
  submit() {
    switch(this.props.confirm.type) {
      case REMOVE:
        return this.props.remove(this.props.confirm.path);
    }
  }

  componentDidUpdate(prevProps, prevSate) {
    if(this.props.confirm) {
      React.findDOMNode(this.refs.yesButton).focus();
    }
  }

  render() {
    return (
      <ReactCSSTransitionGroup transitionName='bottom-bar'>
      {
        !this.props.confirm ? null :
          <section style={styles.section} className='bottom-bar' key='bottom-bar'>
            <div style={styles.div}>Are you sure?</div>
            <button style={{ ...styles.button, ...styles.yes }}
                    ref='yesButton'
                    onClick={this.submit.bind(this)}
                    onBlur={this.props.blur}>
              Yes
            </button>
            <button style={{ ...styles.button, ...styles.no }}>No</button>
          </section>
      }
      </ReactCSSTransitionGroup>
    );
  }
}

const styles = {
  section: {
    position: 'relative',
    transition: 'all .3s ease-in',
    fontSize: '1.5em'
  },
  div: {
    display: 'inline-block',
    width: '48%',
    padding: '15px 1%',
    boxShadow: '0 -2px 1px 1px rgba(144, 96, 21, 0.65)',
    background: '#f39c12',
    textAlign: 'center',
    color: '#fff'
  },
  button: {
    width: '25%',
    padding: '15px 0',
    color: '#fff'
  },
  yes: {
    background: '#2ecc71',
    boxShadow: '0px -2px 1px 1px rgba(19, 105, 55, 0.72)'
  },
  no: {
    background: '#e74c3c',
    boxShadow: '0px -2px 1px 1px rgba(150, 39, 27, 0.54)'
  }
}


function mapStateToProps({ confirm }) {
  return { confirm };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ blur, remove }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
