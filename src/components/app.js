import React from 'react';
import { connect } from 'react-redux';
import { INITIATED } from '../constants/status-types';
import LoginModal from '../components/login-modal';
import TopBar from '../components/top-bar';
import FlashMessage from '../components/flash-message';
import ContentsViewer from '../components/contents-viewer';
import FileEditor from '../components/file-editor';
import SaveBar from '../components/save-bar';

class App extends React.Component {
  render() {
    return (
      <main>
        <article>
          <header>
            <TopBar />
            <FlashMessage status={this.props.status} />
          </header>
          {
            this.props.status.type !== INITIATED ?
              <section>
                <LoginModal />
                <ContentsViewer />
                <FileEditor />
              </section> :
              <div className='loader' />
          }
        </article>
        <footer style={styles.footer}>
          <SaveBar />
        </footer>
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

function mapStateToProps({ status }) {
  return { status };
}

export default connect(mapStateToProps, null)(App);