import debounce from 'lodash.debounce';
import { positionInlineActions } from '../actions';
import { UPDATE_EDITOR_STATE } from '../state/types';
var position = debounce(function (dispatch) { return dispatch(positionInlineActions()); }, 300, {
    leading: true,
    trailing: true,
});
var InlineActionsUIMiddleware = function (store) { return function (next) { return function (action) {
    var result = next(action);
    if (action.type === UPDATE_EDITOR_STATE) {
        setTimeout(function () { return position(store.dispatch); }, 1);
    }
    return result;
}; }; };
export default [InlineActionsUIMiddleware];
//# sourceMappingURL=middleware.js.map