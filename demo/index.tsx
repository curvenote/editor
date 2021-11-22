import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Button, createTheme } from '@material-ui/core';
import { toHTML, toMarkdown, toTex, ReferenceKind, process, toText } from '@curvenote/schema';
import { Sidenote, AnchorBase } from 'sidenotes';
import { Fragment } from 'prosemirror-model';
import { v4 } from 'uuid';
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
import createMiddleware from './middleware';
import 'codemirror/lib/codemirror.css';
import '../styles/index.scss';
import 'sidenotes/dist/sidenotes.css';
import { Options } from '../src/connect';
import snippet from './snippet';
import SuggestionSwitch from '../src/components/Suggestion/Switch';
import InlineActionSwitch from '../src/components/InlineActions/Switch';
import { addComment } from '../src/store/actions';
import CommentEditor from './Comment';

declare global {
  interface Window {
    [index: string]: any;
  }
}

const stateKey = 'myEditor';
const viewId1 = 'view1';
const docId = 'docId';

const store: Store = createStore(rootReducer, applyMiddleware(...createMiddleware(viewId1)));
const theme = createTheme({});

interface Comment {
  id: string;
  content: string;
  color: string;
}

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

let newCommentFn: any;
const opts: Options = {
  transformKeyToId: (key) => key,
  uploadImage: async (file) => {
    // eslint-disable-next-line no-console
    console.log(file);
    return new Promise((resolve) =>
      setTimeout(() => resolve('https://curvenote.dev/images/logo.png'), 2000),
    );
  },
  addComment(_key: any, _view: any) {
    newCommentFn();
    return true;
  },
  onDoubleClick(stateId, viewId) {
    // eslint-disable-next-line no-console
    console.log('Double click', stateId, viewId);
    return false;
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
  getCaptionFragment: (schema) => Fragment.fromArray([schema.text('Hello caption world!')]),
  nodeViews: {},
};

setup(store, opts); // TODO: refactor this awk

function Demo() {
  const [comments, updateComments] = useState<Comment[]>([]);
  newCommentFn = () => {
    const id = v4();
    store.dispatch(addComment(viewId1, id));
    updateComments((c) =>
      c.concat([
        { id, content: '', color: `#${Math.floor(Math.random() * 16777215).toString(16)}` },
      ]),
    );
  };
  const removeComment = () => {
    store.dispatch(actions.removeComment(viewId1, 'sidenote1'));
  };
  useEffect(() => {
    store.dispatch(actions.initEditorState('full', stateKey, true, snippet, 0));
    store.subscribe(() => {
      const myst = document.getElementById('myst');
      const text = document.getElementById('text');
      const tex = document.getElementById('tex');
      const html = document.getElementById('html');
      const editor = store.getState().editor.state.editors[stateKey];
      if (myst) {
        try {
          myst.innerText = toMarkdown(editor.state.doc);
        } catch (e) {
          myst.innerText = 'Error converting to markdown';
        }
      }
      if (tex) {
        try {
          tex.innerText = toTex(editor.state.doc);
        } catch (error) {
          tex.innerText = 'There was an error :(';
        }
      }
      if (text) {
        try {
          text.innerText = toText(editor.state.doc);
        } catch (error) {
          text.innerText = 'There was an error :(';
        }
      }
      if (html) {
        html.innerText = toHTML(editor.state.doc, editor.state.schema, document);
      }
      // Update the counter
      const counts = process.countState(editor.state);
      const words = process.countWords(editor.state);
      const updates = {
        'count-sec': `${counts.sec.all.length} (${counts.sec.total})`,
        'count-fig': `${counts.fig.all.length} (${counts.fig.total})`,
        'count-eq': `${counts.eq.all.length} (${counts.eq.total})`,
        'count-code': `${counts.code.all.length} (${counts.code.total})`,
        'count-table': `${counts.table.all.length} (${counts.table.total})`,
        'count-words': `${words.words}`,
        'count-char': `${words.characters_including_spaces}  (${words.characters_excluding_spaces})`,
      };
      Object.entries(updates).forEach(([key, count]) => {
        const el = document.getElementById(key);
        if (el) el.innerText = count;
      });
    });
  }, []);

  return (
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
            {comments.map(({ id }) => {
              return (
                <Sidenote key={id} sidenote={id} base="anchor">
                  <div
                    style={{
                      border: '1px grey solid',
                    }}
                  >
                    <CommentEditor />
                  </div>
                </Sidenote>
              );
            })}
          </div>
        </article>
        <div className="centered">
          <p>
            Select some text to create an inline comment (cmd-opt-m). See
            <a href="https://curvenote.com"> curvenote.com </a>
            for full demo.
          </p>
          <Button onClick={removeComment}>Remove</Button>
        </div>
        <Suggestions>
          <SuggestionSwitch />
        </Suggestions>
        <Attributes />
      </React.StrictMode>
    </Provider>
  );
}

window.store = store;
ReactDOM.render(<Demo />, document.getElementById('root'));
