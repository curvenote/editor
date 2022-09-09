import React, { useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { createTheme } from '@material-ui/core';
import { ReferenceKind } from '@curvenote/schema';
import { Fragment } from 'prosemirror-model';
import type { Store, LinkResult } from '../src';
import {
  middleware,
  EditorMenu,
  Suggestions,
  actions,
  createEditor,
  Attributes,
  InlineActions,
} from '../src';
import SuggestionSwitch from '../src/components/Suggestion/Switch';
import InlineActionSwitch from '../src/components/InlineActions/Switch';
import Editor from '../src/components/NextEditor';
import rootReducer from './reducers';
import 'codemirror/lib/codemirror.css';
import '../styles/index.scss';
import 'sidenotes/dist/sidenotes.css';
import type { Options } from '../src/connect';
import { configureStore } from '@reduxjs/toolkit';

declare global {
  interface Window {
    [index: string]: any;
  }
}

const stateKey = 'myEditor';
const viewId1 = 'view1';
const docId = 'docId';
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

export function createStore(): Store {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware: any) => {
      return [
        ...middleware,
        ...getDefaultMiddleware({
          serializableCheck: false,
          immutableCheck: false,
        }),
      ];
    },
  });
}

const theme = createTheme({});
function createOptions(store: Store) {
  const newComment = () => {
    store.dispatch(actions.addCommentToSelectedView('sidenote1'));
  };
  const removeComment = () => {
    store.dispatch(actions.removeComment(viewId1, 'sidenote1'));
  };
  return {
    transformKeyToId: (key) => key,
    uploadImage: async (file) => {
      // eslint-disable-next-line no-console
      console.log(file);
      return new Promise((resolve) =>
        setTimeout(() => resolve('https://curvenote.dev/images/logo.png'), 2000),
      );
    },
    getDocId() {
      return docId;
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
    theme,
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
  } as Options;
}

export function DemoEditor({ content, store = createStore() }: { content: string; store?: Store }) {
  const editor = useMemo(() => createEditor(store, createOptions(store)), []);
  useEffect(() => {
    window.store = store;
    return () => {
      window.store = undefined;
    };
  }, [store]);
  return (
    <Provider store={store}>
      <h1>Next</h1>
      <React.StrictMode>
        <article id={docId} className="content centered">
          <EditorMenu standAlone />
          <InlineActions>
            <InlineActionSwitch />
          </InlineActions>
          <Editor editor={editor} stateKey={stateKey} viewId={viewId1} initialContent={content} />
          <Suggestions>
            <SuggestionSwitch />
          </Suggestions>
          <Attributes />
        </article>
      </React.StrictMode>
    </Provider>
  );
}
