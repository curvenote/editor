import { combineReducers } from 'redux';
import state from './state/reducers';
import ui from './ui/reducers';
import suggestion from './suggestion/reducers';
import attrs from './attrs/reducers';
var reducer = combineReducers({
    state: state,
    ui: ui,
    suggestion: suggestion,
    attrs: attrs,
});
export default reducer;
//# sourceMappingURL=reducers.js.map