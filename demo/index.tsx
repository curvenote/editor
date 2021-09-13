import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Button, createTheme } from '@material-ui/core';
import { toHTML, toMarkdown, toTex, ReferenceKind } from '@curvenote/schema';
import { Sidenote, AnchorBase } from 'sidenotes';
import {
  actions,
  Editor,
  EditorMenu,
  Store,
  setup,
  Suggestions,
  Attributes,
  InlineActions,
  LinkResult,
} from '../src';
import rootReducer from './reducers';
import middleware from './middleware';
import '../styles/index.scss';
import 'sidenotes/dist/sidenotes.css';
import { Options } from '../src/connect';
import snippet from './snippet';
import SuggestionSwitch from '../src/components/Suggestion/Switch';
import InlineActionSwitch from '../src/components/InlineActions/Switch';

declare global {
  interface Window {
    [index: string]: any;
  }
}

const store: Store = createStore(rootReducer, applyMiddleware(...middleware));
const theme = createTheme({});

const stateKey = 'myEditor';
const viewId1 = 'view1';
const docId = 'docId';
const newComment = () => {
  store.dispatch(actions.addCommentToSelectedView('sidenote1'));
};
const removeComment = () => {
  store.dispatch(actions.removeComment(viewId1, 'sidenote1'));
};

const someLinks: LinkResult[] = [
  {
    kind: ReferenceKind.cite,
    uid: 'simpeg2015',
    label: 'simpeg',
    content: 'Cockett et al., 2015',
    title:
      'SimPEG: An open source framework for simulation and gradient based parameter estimation in geophysical applications.',
  },
  {
    kind: ReferenceKind.link,
    uid: 'https://curvenote.com',
    label: null,
    content: 'Curvenote',
    title: 'Move ideas forward',
  },
];

const opts: Options = {
  transformKeyToId: (key) => key,
  uploadImage: async (file) => {
    // eslint-disable-next-line no-console
    console.log(file);
    return new Promise((resolve) =>
      setTimeout(() => resolve('https://curvenote.dev/images/logo.png'), 2000),
    );
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
  getDocId() {
    return docId;
  },
  theme,
  throttle: 0,
  citationPrompt: async () => [
    {
      key: 'simpeg2015',
      kind: ReferenceKind.cite,
      text: 'Cockett et al, 2015',
      label: 'simpeg',
      title: '',
    },
  ],
  createLinkSearch: async () => ({ search: () => someLinks }),
  nodeViews: {},
};

setup(store, opts);

window.store = store;
store.dispatch(actions.initEditorState('full', stateKey, true, snippet, 0));

store.subscribe(() => {
  const myst = document.getElementById('myst');
  const tex = document.getElementById('tex');
  const html = document.getElementById('html');
  const editor = store.getState().editor.state.editors[stateKey];
  if (myst) {
    // TODO: revive this
    // myst.innerText = toMarkdown(editor.state.doc);
  }
  if (tex) {
    try {
      tex.innerText = toTex(editor.state.doc);
    } catch (error) {
      tex.innerText = 'There was an error :(';
    }
  }
  if (html) {
    html.innerText = toHTML(editor.state.doc, editor.state.schema, document);
  }
});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <EditorMenu standAlone />
      <InlineActions>
        <InlineActionSwitch />
      </InlineActions>
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
      <div className="centered">
        <p>
          Select some text to create an inline comment (cmd-opt-m). See
          <a href="https://curvenote.com"> curvenote.com </a>
          for full demo.
        </p>
        <Button onClick={newComment}>Comment</Button>
        <Button onClick={removeComment}>Remove</Button>
      </div>
      <Suggestions>
        <SuggestionSwitch />
      </Suggestions>
      <Attributes />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);
