import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Button, createMuiTheme } from '@material-ui/core';
import { toMarkdown, toTex } from '@iooxa/schema';
import { CommentContainer } from '@iooxa/comments';
import {
  actions, Editor, EditorMenu, Store, setup, Suggestion, Attributes,
} from '../src';
import rootReducer from './reducers';
import middleware from './middleware';
import '../styles/index.scss';
import '@iooxa/comments/dist/comments.css';
import { Options } from '../src/connect';

declare global {
  interface Window {
    [index: string]: any;
  }
}

const store: Store = createStore(
  rootReducer,
  applyMiddleware(
    ...middleware,
  ),
);
const theme = createMuiTheme({});

const stateKey = 'myEditor';
const viewId1 = 'view1';
const docId = 'docId';
const newComment = () => {
  store.dispatch(actions.addCommentToSelectedView('comment1'));
};
const removeComment = () => {
  store.dispatch(actions.removeComment(viewId1, 'comment1'));
};

const opts: Options = {
  transformKeyToId: (key) => key,
  image: {
    upload: async (file) => {
      // eslint-disable-next-line no-console
      console.log(file);
      return new Promise((resolve) => (
        setTimeout(() => resolve('https://iooxa.dev/images/logo.png'), 3000)
      ));
    },
    downloadUrl: async (src) => src,
  },
  addComment() {
    newComment();
    return true;
  },
  getDocId() { return docId; },
  theme,
  throttle: 0,
};

setup(store, opts);

window.store = store;
store.dispatch(actions.initEditorState(stateKey, true, '<p>Hello editing!<a href="https://iooxa.dev/introduction">@iooxa/components</a></p><img src="https://iooxa.dev/images/logo.png">', 0));


store.subscribe(() => {
  const myst = document.getElementById('myst');
  const tex = document.getElementById('tex');
  if (myst) {
    const editorState = store.getState().editor.state.editors[stateKey].state;
    myst.innerText = toMarkdown(editorState.doc);
  }
  if (tex) {
    const editorState = store.getState().editor.state.editors[stateKey].state;
    tex.innerText = toTex(editorState.doc);
  }
});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <EditorMenu standAlone />
      <article id={docId} className="content centered">
        <comment-base anchor="anchor">
          <div className="selected">
            <Editor stateKey={stateKey} viewId={viewId1} />
          </div>
        </comment-base>
        {/* <Editor stateKey={stateKey} viewId="two" /> */}
        <div className="comments">
          <CommentContainer comment="comment1" base="anchor">
            <div style={{ width: 280, height: 100, backgroundColor: 'green' }} />
          </CommentContainer>
          <CommentContainer comment="comment2" base="anchor">
            <div style={{ width: 280, height: 100, backgroundColor: 'red' }} />
          </CommentContainer>
        </div>
      </article>
      <Button onClick={newComment}>Comment</Button>
      <Button onClick={removeComment}>Remove</Button>
      <Suggestion />
      <Attributes />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);
