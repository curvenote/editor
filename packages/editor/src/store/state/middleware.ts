import type { Middleware } from '../types';
import type { UpdateEditorState } from './types';
import { UPDATE_EDITOR_STATE } from './types';

const updateProsemirrorViewsMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === UPDATE_EDITOR_STATE) {
    const { stateId, viewId, editorState } = (action as UpdateEditorState).payload;
    const state = store.getState().editor.state.editors[stateId];
    const { views } = store.getState().editor.state;
    if (state == null) return result;
    state.viewIds.forEach((id) => {
      if (id === viewId) return;
      views[id]?.view.updateState(editorState);
    });
  }
  return result;
};

export default [updateProsemirrorViewsMiddleware];
