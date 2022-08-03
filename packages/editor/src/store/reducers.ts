import { combineReducers } from 'redux';
import state from './state/reducers';
import ui from './ui/reducers';
import suggestion from './suggestion/reducers';
import attrs from './attrs/reducers';

const reducer = combineReducers({
  state,
  ui,
  suggestion,
  attrs,
});

export default reducer;
