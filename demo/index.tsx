/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import {
  setup, Store, Sidenote, InlineAnchor, AnchorBase,
} from '../src';
import rootReducer from './reducers';
import '../styles/index.scss';
import './index.scss';
import { deselectSidenote } from '../src/store/ui/actions';

declare global {
  interface Window {
    [index: string]: any;
  }
}

const store: Store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
window.store = store;
setup(store, { padding: 10 });

const docId = 'article';
const baseAnchor = 'anchor';
const blue = 'blue';
const red = 'red';
const green = 'green';

const deselect = () => store.dispatch(deselectSidenote(docId));

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <article id={docId} onClick={deselect}>
        <h1>sidenotes</h1>
        <button type="button" onClick={deselect}>Deselect Sidenotes</button>
        <AnchorBase anchor={baseAnchor} className="greenBase">
          <p>
            <InlineAnchor sidenote={blue} className="blue">
              A sidenote
            </InlineAnchor>
            {' '}
            and
            {' '}
            <InlineAnchor sidenote={red} className="red">
              another red sidenote!
            </InlineAnchor>
          </p>
          <ul>
            <li>Must see all the <InlineAnchor sidenote={red} className="red">sidenotes</InlineAnchor> at once, so they should be in the margins!</li>
            <li>Must be associated with a block (a small bit of content), that is versioned and must point to content inside of that block.</li>
          </ul>
          <p>
            The sidenotes location <InlineAnchor sidenote={blue} className="blue">information</InlineAnchor> is a stand alone package.
            For example, the reducer should be based on the ID of the sidenote that can get triggered (or not).
          </p>
          <p>
            Has a mini reducer in there to keep internal state
            There needs to be one for each sidenote list, and one per doc/article.
            Positions things based on height of each <InlineAnchor sidenote={blue} className="blue">sidenotes</InlineAnchor>, and a list of ids in the document. These ids are used to look up position and place the position of the sidenotes based on a relative container that is along side the doc.
            Visible
            Selected
            The sidenotes dont have to reposition unless one is selected.
            Each time do a sweep of the doc and reposition the elements. The animation can be handled by CSS.
          </p>
          <p>
            <InlineAnchor sidenote={red} className="red">Next sidenote!</InlineAnchor>
          </p>
          <p>
            <InlineAnchor sidenote={red} className="red">sidenotes</InlineAnchor>
          </p>
        </AnchorBase>
        <div className="sidenotes">
          <Sidenote sidenote={blue} base={baseAnchor}>
            <div style={{ width: 280, height: 150, backgroundColor: 'blue' }} />
          </Sidenote>
          <Sidenote sidenote={red} base={baseAnchor}>
            <div style={{ width: 280, height: 100, backgroundColor: 'red' }} />
          </Sidenote>
          <Sidenote sidenote={green} base={baseAnchor}>
            <div style={{ width: 280, height: 100, backgroundColor: 'green' }}>Attached to sidenote base.</div>
          </Sidenote>
        </div>

      </article>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);
