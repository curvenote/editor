import { EditorActionTypes, EditorsState } from './types';
export declare const initialState: EditorsState;
declare const editorReducer: (state: EditorsState | undefined, action: EditorActionTypes) => EditorsState;
export default editorReducer;
