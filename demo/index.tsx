import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Button, createMuiTheme } from '@material-ui/core';
import { toMarkdown } from '@iooxa/schema';
import { CommentContainer } from '@iooxa/comments';
import {
  actions, Editor, EditorMenu, Store, setup, Suggestion, Attributes,
} from '../src';
import rootReducer from './reducers';
import middleware from './middleware';
import '../styles/index.scss';
import '@iooxa/comments/dist/comments.css';
import { Options } from '../src/connect';
import { addComment } from '../src/prosemirror/plugins/comments';

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
  theme,
  throttle: 0,
};

setup(store, opts);
const stateKey = 'myEditor';
const viewId1 = 'view1';

window.store = store;
store.dispatch(actions.initEditorState(stateKey, true, '<p>Hello editing!<a href="https://iooxa.dev/introduction">@iooxa/components</a></p><img src="https://iooxa.dev/images/logo.png">', 0));


store.subscribe(() => {
  const el = document.getElementById('myst');
  if (!el) return;
  const editorState = store.getState().editor.state.editors[stateKey].state;
  el.innerText = toMarkdown(editorState.doc);
});

const newComment = () => {
  const { view } = store.getState().editor.state.views[viewId1];
  addComment(view);
};

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <EditorMenu standAlone stateKey={stateKey} />
      <article className="content centered" data-doc="doc1">
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
      <Suggestion />
      <Attributes />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);
