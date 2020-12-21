import { combineReducers } from 'redux';
import {
  State, CommentUIActions, Reducer, reducer,
} from '../src';

const combinedReducers: Reducer = combineReducers({
  comments: reducer,
}) as Reducer;

function rootReducer(state: State | undefined, action: CommentUIActions): State {
  console.log('New Action: ', action);
  return combinedReducers(state, action);
}

export default rootReducer;
