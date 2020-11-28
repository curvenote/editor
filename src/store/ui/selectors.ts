import { State } from '../types';
import config from '../../config';
import { getEditor } from '../state/selectors';

export function getUI(state: State) {
  return state.prosemirror.ui;
}

export function getSelectedEditorAndViews(state: State) {
  const { stateId } = getUI(state);
  return getEditor(state, stateId);
}

export function isEditorViewFocused(state: State, stateKey: any | null, viewId: string) {
  if (stateKey == null) return null;
  const stateId = config.transformKeyToId(stateKey);
  const { ui } = state.prosemirror;
  return (
    ui.stateId === stateId
    && ui.viewId === viewId
    && ui.focused
  );
}
