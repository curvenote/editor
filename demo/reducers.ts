import { combineReducers } from 'redux';
import {
  State, PROSEMIRROR_ACTIONS, Reducer, reducer,
} from '../src';

const combinedReducers: Reducer = combineReducers({
  prosemirror: reducer,
}) as Reducer;

function rootReducer(state: State | undefined, action: PROSEMIRROR_ACTIONS): State {
  console.log('New Action: ', action);
  return combinedReducers(state, action);
}

export default rootReducer;
