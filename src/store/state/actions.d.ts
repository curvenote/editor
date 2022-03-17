import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schemas } from '@curvenote/schema';
import { EditorActionTypes } from './types';
import { AppThunk } from '../types';
export declare function initEditorState(useSchema: schemas.UseSchema, stateKey: any, editable: boolean, content: string, version: number): EditorActionTypes;
export declare function updateEditorState(stateKey: any, viewId: string | null, editorState: EditorState, tr?: Transaction): EditorActionTypes;
export declare function applyProsemirrorTransaction(stateKey: any, viewId: string | null, tr: Transaction, focus?: boolean): AppThunk<boolean>;
export declare function subscribeView(stateKey: any, viewId: string, view: EditorView): EditorActionTypes;
export declare function unsubscribeView(stateKey: any, viewId: string): EditorActionTypes;
export declare function resetAllEditorsAndViews(): EditorActionTypes;
export declare function resetAllViews(): EditorActionTypes;
export declare function resetEditorAndViews(stateKey: any): EditorActionTypes;