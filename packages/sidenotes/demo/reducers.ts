import { combineReducers } from 'redux';
import { State, SidenotesUIActions, Reducer, reducer } from '../src';

const combinedReducers: Reducer = combineReducers({
  sidenotes: reducer,
}) as Reducer;

function rootReducer(state: State | undefined, action: SidenotesUIActions): State {
  console.log('New Action: ', action);
  return combinedReducers(state, action);
}

export default rootReducer;
