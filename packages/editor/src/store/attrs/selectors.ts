import { State } from '../types';

export const showAttributeEditor = (state: State) => state.editor.attrs.show;
export const getAttributeEditorLocation = (state: State) => state.editor.attrs.location;
export const getAttributeEditorPos = (state: State) => state.editor.attrs.pos;
