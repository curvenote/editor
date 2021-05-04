import { schemas } from '@curvenote/schema';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
export declare function createEditorState(useSchema: schemas.UseSchema, stateKey: any, content: string, version: number, startEditable: boolean): EditorState<any>;
export declare function createEditorView(dom: HTMLDivElement, state: EditorState, dispatch: (tr: Transaction) => void): EditorView;
