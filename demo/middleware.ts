import runtime from '@curvenote/runtime';
import thunkMiddleware from 'redux-thunk';
import { UI_SELECT_SIDENOTE, SelectSidenoteAction } from 'sidenotes/dist/src/store/ui/types';
import { Middleware, middleware, selectors, actions } from '../src';

const selectComment =
  (viewId: string): Middleware =>
  (store) =>
  (next) =>
  (action) => {
    const result = next(action);
    if (action.type === UI_SELECT_SIDENOTE) {
      const { view } = selectors.getEditorView(store.getState(), viewId);
      if (!view) return result;
      const { sidenoteId } = (action as SelectSidenoteAction).payload;
      store.dispatch(actions.selectComment(view, sidenoteId));
    }
    return result;
  };

function createMiddleware(viewId: string) {
  return [
    thunkMiddleware,
    ...middleware,
    selectComment(viewId),
    runtime.triggerEvaluate,
    runtime.dangerousEvaluatation,
  ];
}

export default createMiddleware;
