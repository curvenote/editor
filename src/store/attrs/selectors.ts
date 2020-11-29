import { State } from '../types';

export const showAttributeEditor = (state: State) => state.prosemirror.attrs.showAttributeEditor;
export const getAttributeEditorPos = (state: State) => state.prosemirror.attrs.attributePos;
