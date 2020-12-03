import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createMuiTheme } from '@material-ui/core';
import {
  actions, Editor, EditorMenu, Store, setup, Suggestion,
} from '../src';
import rootReducer from './reducers';
import middleware from './middleware';
import '../styles/index.scss';
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

window.store = store;
store.dispatch(actions.initEditorState(stateKey, true, '<p>Hello editing!<a href="https://iooxa.dev/introduction">@iooxa/components</a></p><img src="https://iooxa.dev/images/logo.png">', 0));

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <EditorMenu standAlone stateKey={stateKey} />
      <article className="content selected centered">
        <Editor stateKey={stateKey} viewId="one" />
      </article>
      {/* <Editor stateKey={stateKey} viewId="two" /> */}
      <Suggestion />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);
