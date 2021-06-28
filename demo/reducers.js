import runtime from '@curvenote/runtime';
import * as sidenotes from 'sidenotes';
import { combineReducers } from 'redux';
import { reducer } from '../src';
var combinedReducers = combineReducers({
    editor: reducer,
    runtime: runtime.reducer,
    sidenotes: sidenotes.reducer,
});
function rootReducer(state, action) {
    return combinedReducers(state, action);
}
export default rootReducer;
//# sourceMappingURL=reducers.js.map