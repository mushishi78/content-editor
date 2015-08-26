import React from 'react';
import { connect } from 'react-redux';
import { blur, create } from '../actions/index';
import { CREATE } from '../constants/action-types';
import { setSelectionRange } from '../utils';

let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

class PromptBar extends React.Component {
  setValue(e) { this.setState({ path: e.target.value }); }
  handleKeyDown(e) { if(e.key === 'Enter') { this.submit(); } }

  submit() {
    switch(this.state.type) {
      case CREATE:
        return this.props.create(this.state.path);
    }
  }

  componentWillReceiveProps(props) {
    if(props.prompt) { this.setState(props.prompt); }
  }

  componentDidUpdate(prevProps, prevSate) {
    if(prevProps.prompt !== this.props.prompt && this.props.prompt) {
      const pathInput = React.findDOMNode(this.refs.pathInput);
      const index = this.props.prompt.path.search('untitled');
      pathInput.focus();
      if(index >= 0) { setSelectionRange(pathInput, index, index + 'untitled'.length); }
    }
  }

  render() {
    return (
      <ReactCSSTransitionGroup transitionName='prompt-bar'>
      {
        !this.props.prompt ? null :
          <section style={styles.section} className='prompt-bar' key='prompt-bar'>
            <input type='text'
                   style={styles.input}
                   value={this.state.path}
                   onChange={this.setValue.bind(this)}
                   ref='pathInput'
                   onKeyDown={this.handleKeyDown.bind(this)}
                   onBlur={this.props.blur}/>

            <button style={styles.button} onClick={this.submit.bind(this)}>
              {this.props.prompt.type}
            </button>
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
  input: {
    width: '73%',
    padding: '15px 1%',
    boxShadow: '0 -2px 1px 1px #1B6DA5',
    border: 'none'
  },
  button: {
    width: '25%',
    padding: '15px 0',
    background: '#2ecc71',
    color: '#fff',
    boxShadow: '0px -2px 1px 1px #2D6D98'
  }
}

function mapStateToProps({ prompt }) {
  return { prompt };
}

function mapDispatchToProps(dispatch) {
  return {
    blur: () => dispatch(blur()),
    create: (href) => dispatch(create(href))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PromptBar);
