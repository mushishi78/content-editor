import React from 'react';
import { connect } from 'react-redux';
import { INITIATED } from '../constants/status-types';
import LoginModal from '../components/login-modal';
import LogoutButton from '../components/logout-button';
import Breadcrumbs from '../components/breadcrumbs';
import FlashMessage from '../components/flash-message';
import ListViewer from '../components/list-viewer';
import FileEditor from '../components/file-editor';

class App extends React.Component {
  render() {
    return (
      <main>
        <header style={ { background: '#fff' } }>
          <LogoutButton />
          <Breadcrumbs />
        </header>
        <article>
          <FlashMessage status={this.props.status} />
          {
            this.props.status.type !== INITIATED ?
              <div>
                <LoginModal />
                <ListViewer />
                <FileEditor />
              </div> :
              <div className='loader' />
          }
        </article>
      </main>
    );
  }
}

function mapStateToProps({ status }) {
  return { status };
}

export default connect(mapStateToProps, null)(App);
