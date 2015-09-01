import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/index';
import { IN_PROGRESS } from '../constants/status-types';
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
          <LocationBar href={this.props.location.href}
                       setLocation={this.props.setLocation} />

          <FlashMessage status={this.props.status} />
          {
            this.props.status.type === IN_PROGRESS ? <div className='loader' /> :
            !this.props.loggedIn ? <LoginModal login={this.props.login} /> :
              <article>
                <TopBar loggedIn={this.props.loggedIn}
                        href={this.props.location.href}
                        logout={this.props.logout} />

                <ContentsViewer contents={this.props.contents}
                                location={this.props.location}
                                permissions={this.props.permissions}
                                createPrompt={this.props.createPrompt}
                                movePrompt={this.props.movePrompt}
                                removeConfirm={this.props.removeConfirm}
                                upload={this.props.upload} />

                <FileEditor file={this.props.file}
                            permissions={this.props.permissions}
                            editorWidth={this.props.editorWidth}
                            setText={this.props.setText}
                            changeEditorWidth={this.props.changeEditorWidth} />

                <footer style={styles.footer}>
                  <SaveBar file={this.props.file}
                           save={this.props.save} />

                  <PromptBar prompt={this.props.prompt}
                             blur={this.props.blur}
                             create={this.props.create}
                             move={this.props.move} />

                  <ConfirmBar confirm={this.props.confirm}
                              blur={this.props.blur}
                              remove={this.props.remove} />
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

export default connect((state) => state, actionCreators)(App);
