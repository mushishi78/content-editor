import React from 'react';
import { connect } from 'react-redux';

import { IN_PROGRESS } from '../constants/status-types';
import { login } from '../actions/index';
import ConfirmBar from '../components/confirm-bar';
import ContentsViewer from '../components/contents-viewer';
import FileEditor from '../components/file-editor';
import FlashMessage from '../components/flash-message';
import LocationBar from '../components/location-bar';
import LoginModal from '../components/login-modal';
import PromptBar from '../components/prompt-bar';
import SaveBar from '../components/save-bar';
import TopBar from '../components/top-bar';

class App extends React.Component {
  componentDidMount() { this.props.login(); }
  render() {
    return (
        <main>
          <LocationBar />
          <FlashMessage status={this.props.status} />
          {
            this.props.status.type === IN_PROGRESS ? <div className='loader' /> :
            !this.props.loggedIn ? <LoginModal /> :
              <article>
                <TopBar />
                <ContentsViewer />
                <FileEditor />
                <footer style={styles.footer}>
                  <SaveBar />
                  <PromptBar />
                  <ConfirmBar />
                </footer>
              </article>
          }
        </main>
    );
  }
}

const styles = {
  footer: {
    position: 'fixed',
    bottom: '0',
    width: '100%'
  }
}

function mapStateToProps({ status, loggedIn }) {
  return { status, loggedIn };
}

export default connect(mapStateToProps, { login })(App);
