import React from 'react';
import addressbar from 'addressbar';

export default class LocationBar extends React.Component {
  componentDidMount() {
    addressbar.on('change', this.onUrlChange.bind(this));
    this.props.setLocation(this.decode(addressbar.value));
  }

  componentDidUpdate() {
    document.title = 'Content Editor ' + this.props.href;
    addressbar.value = location.origin + this.props.href;
  }

  onUrlChange(event) {
    event.preventDefault();
    this.props.setLocation(this.decode(event.target.value));
  }

  decode(url) {
    return decodeURIComponent(url.replace(location.origin, ''));
  }

  render() { return null; }
}
