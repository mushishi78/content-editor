import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import addressbar from 'addressbar';
import { setLocation } from '../actions/index';

class LocationBar extends React.Component {
  componentDidMount() {
    addressbar.on('change', this.onUrlChange.bind(this));
    this.props.setLocation(addressbar.value.replace(location.origin, ''));
  }

  componentDidUpdate() {
    document.title = 'Content Editor ' + this.props.href;
    addressbar.value = location.origin + this.props.href;
  }

  onUrlChange(event) {
    event.preventDefault();
    this.props.setLocation(event.target.value.replace(location.origin, ''));
  }

  render() { return null; }
}

function mapStateToProps({ location: { href } }) {
  return { href };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setLocation }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationBar);
