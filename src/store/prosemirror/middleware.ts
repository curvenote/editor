import { Middleware } from '../types';
import { UpdateProsemirrorState, UPDATE_PROSEMIRROR_STATE } from './types';

const updateProsemirrorViewsMiddleware: Middleware = (
  (store) => (next) => (action) => {
    const result = next(action);
    if (action.type === UPDATE_PROSEMIRROR_STATE) {
      const { stateId, viewId, editorState } = (action as UpdateProsemirrorState).payload;
      const state = store.getState().prosemirror.state[stateId];
      const { views } = store.getState().prosemirror;
      if (state == null) return result;
      state.viewIds.forEach((id) => {
        if (id === viewId) return;
        views[id]?.view.updateState(editorState);
      });
    }
    return result;
  }
);

export default [updateProsemirrorViewsMiddleware];
