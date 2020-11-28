import { combineReducers } from 'redux';
import state from './state/reducers';
import ui from './ui/reducers';
import suggestion from './suggestion/reducers';

const reducer = combineReducers({
  state,
  ui,
  suggestion,
});

export default reducer;
