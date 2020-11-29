import { State } from '../types';

export const showAttributeEditor = (state: State) => state.editor.attrs.showAttributeEditor;
export const getAttributeEditorPos = (state: State) => state.editor.attrs.attributePos;
