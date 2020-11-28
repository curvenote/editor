import {
  UIActionTypes, SELECT_EDITOR_VIEW, FOCUS_EDITOR_VIEW,
} from './types';
import config from '../../config';

export function selectEditorView(stateKey: any, viewId: string): UIActionTypes {
  const stateId = config.transformKeyToId(stateKey);
  return {
    type: SELECT_EDITOR_VIEW,
    payload: { stateId, viewId },
  };
}

export function focusEditorView(
  stateKey: any, viewId: string | null, focused: boolean,
): UIActionTypes {
  const stateId = config.transformKeyToId(stateKey);
  return {
    type: FOCUS_EDITOR_VIEW,
    payload: { stateId, viewId, focused },
  };
}
