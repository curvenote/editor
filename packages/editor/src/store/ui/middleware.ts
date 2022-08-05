import debounce from 'lodash.debounce';
import { positionInlineActions } from '../actions';
import type { Dispatch, Middleware } from '../types';
import { UPDATE_EDITOR_STATE } from '../state/types';

const position = debounce((dispatch: Dispatch) => dispatch(positionInlineActions()), 25, {
  leading: true,
  trailing: true,
});

const InlineActionsUIMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === UPDATE_EDITOR_STATE) {
    // This is debounced and after the view action goes through
    setTimeout(() => position(store.dispatch), 1);
  }
  return result;
};

export default [InlineActionsUIMiddleware];
