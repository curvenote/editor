import { combineReducers } from 'redux';
import state from './state/reducers';
import ui from './ui/reducers';

const reducer = combineReducers({
  state,
  ui,
});

export default reducer;
