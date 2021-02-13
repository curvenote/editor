import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Button, createMuiTheme } from '@material-ui/core';
import { toMarkdown, toTex } from '@iooxa/schema';
import { Sidenote, AnchorBase } from 'sidenotes';
import {
  actions, Editor, EditorMenu, Store, setup, Suggestion, Attributes,
} from '../src';
import rootReducer from './reducers';
import middleware from './middleware';
import '../styles/index.scss';
import 'sidenotes/dist/sidenotes.css';
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
  store.dispatch(actions.addCommentToSelectedView('sidenote1'));
};
const removeComment = () => {
  store.dispatch(actions.removeComment(viewId1, 'sidenote1'));
};

const citation = {
  uid: 'simpeg2015',
  internal: false,
  title: 'SimPEG: An open source framework for simulation and gradient based parameter estimation in geophysical applications.',
  authors: ['Cockett, Rowan', 'Kang, Seogi', 'Heagy, Lindsey J.', 'Pidlisecky, Adam', 'Oldenburg, Douglas W.'],
  date: new Date(),
  url: 'https://doi.org/10.1016/j.cageo.2015.09.015',
  doi: '10.1016/j.cageo.2015.09.015',
  journal: 'Computers & Geosciences, 85, 142–154.',
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
  onDoubleClick(stateId, viewId) {
    // eslint-disable-next-line no-console
    console.log('Double click', stateId, viewId);
    return false;
  },
  getDocId() { return docId; },
  theme,
  throttle: 0,
  citationPrompt: async () => ['simpeg2015'],
  citationKeyToJson: async () => (citation),
  createCitationSearch: async () => ({ search: () => ['simpeg2015'], ids: ['simpeg2015'] }),
};

setup(store, opts);

window.store = store;
store.dispatch(actions.initEditorState(stateKey, true, '<p>Hello editing!<a href="https://iooxa.dev/introduction">@iooxa/components</a> <cite-group><cite key="simpeg2015"></cite></cite-group></p><img src="https://iooxa.dev/images/logo.png">', 0));


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
        <AnchorBase anchor="anchor">
          <div className="selected">
            <Editor stateKey={stateKey} viewId={viewId1} />
          </div>
        </AnchorBase>
        {/* <Editor stateKey={stateKey} viewId="two" /> */}
        <div className="sidenotes">
          <Sidenote sidenote="sidenote1" base="anchor">
            <div style={{ width: 280, height: 100, backgroundColor: 'green' }} />
          </Sidenote>
          <Sidenote sidenote="sidenote2" base="anchor">
            <div style={{ width: 280, height: 100, backgroundColor: 'red' }} />
          </Sidenote>
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
