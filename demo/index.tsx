/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import {
  setup, Store, CommentContainer, CommentAnchor,
} from '../src';
import rootReducer from './reducers';
import '../styles/index.scss';
import './index.scss';
import { deselectComment } from '../src/store/ui/actions';

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
const comment1 = 'comment1';
const comment2 = 'comment2';
const comment3 = 'comment3';

const deselect = () => store.dispatch(deselectComment(docId));

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <article id={docId} onClick={deselect}>
        <h1>@curvenote/comments</h1>
        <button type="button" onClick={deselect}>Deselect Comments</button>
        <comment-base anchor={baseAnchor}>
          <p>
            <CommentAnchor comment={comment1}>
              A comment
            </CommentAnchor>
            {' '}
            and
            {' '}
            <CommentAnchor comment={comment2}>
              another comment!
            </CommentAnchor>
          </p>
          <ul>
            <li>Must see all the <comment-anchor comment={comment2}>comments</comment-anchor> at once, so they should be in the margins!</li>
            <li>Must be associated with a block (a small bit of content), that is versioned and must point to content inside of that block.</li>
          </ul>
          <p>
            The comments location <CommentAnchor comment={comment1}>information</CommentAnchor> should be a stand alone repo.
            For example, <code>useCommentLocation</code> allows to be based on the ID of the comment that can get triggered (or not).
          </p>
          <p>
            Has a mini reducer in there to keep internal state
            There needs to be one for each comment list.
            Positions things based on height of the <CommentAnchor comment={comment1}>comments</CommentAnchor>, and a list of ids in the document. These ids are used to look up position and place the position of the comments based on a relative container that is along side the doc.
            Visible
            Selected
            The comments dont have to reposition unless one is selected.
            Each time do a sweep of the doc and reposition the elements. The animation can be handled by CSS.
          </p>
          <p>
            <CommentAnchor comment={comment2}>Next comment!</CommentAnchor>
          </p>
          <p>
            <CommentAnchor comment={comment2}>comments</CommentAnchor>
          </p>
        </comment-base>
        <div className="comments">
          <CommentContainer comment={comment1} base={baseAnchor}>
            <div style={{ width: 280, height: 150, backgroundColor: 'blue' }} />
          </CommentContainer>
          <CommentContainer comment={comment2} base={baseAnchor}>
            <div style={{ width: 280, height: 100, backgroundColor: 'red' }} />
          </CommentContainer>
          <CommentContainer comment={comment3} base={baseAnchor}>
            <div style={{ width: 280, height: 100, backgroundColor: 'green' }} />
          </CommentContainer>
        </div>

      </article>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);
