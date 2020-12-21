import runtime from '@iooxa/runtime';
import { reducer as comments } from '@iooxa/comments';
import { combineReducers } from 'redux';
import {
  State, EditorActions, Reducer, reducer,
} from '../src';

const combinedReducers: Reducer = combineReducers({
  editor: reducer,
  runtime: runtime.reducer,
  comments,
}) as Reducer;

function rootReducer(state: State | undefined, action: EditorActions): State {
  console.log('New Action: ', action);
  return combinedReducers(state, action);
}

export default rootReducer;
