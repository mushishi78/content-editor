import React from 'react';
import 'react/addons';
import { FAILED } from '../constants/status-types';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

export default class FlashMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  componentWillReceiveProps(newProps) {
    if(newProps.status.flash) {
      this.setState({ show: true });
      setTimeout(() => { this.setState({ show: false })}, 2000 );
    }
  }

  divWrapperStyle() {
    return {
      ...styles.divWrapper,
      background: this.props.status.type === FAILED ? '#e74c3c' : '#2ecc71'
    };
  }

  icon() {
    return this.props.status.type === FAILED ? icons.failed : icons.success;
  }

  render() {
    return (
      <ReactCSSTransitionGroup transitionName='flash'>
        {
          !this.state.show ? null :
            <div style={this.divWrapperStyle()} className='flash' key='flash'>
              <div style={styles.div}>
                <i style={styles.icon} className={this.icon()} />
                {this.props.status.flash}
              </div>
            </div>
        }
      </ReactCSSTransitionGroup>
    );
  }
}

const icons = {
  failed: 'octicon octicon-alert',
  success: 'octicon octicon-check'
}

const styles = {
  divWrapper: {
    color: '#ecf0f1',
    textAlign: 'center',
    overflow: 'hidden',
    fontSize: '2em',
    transition: 'all .3s ease-in',
    width: '100%'
  },
  div: {
    margin: '0.25em 0'
  },
  icon: {
    fontSize: '1em',
    marginRight: '2%'
  }
};
