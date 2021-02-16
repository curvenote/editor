import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import schema from './schema';
export { schema };
export declare function createEditorState(stateKey: any, content: string, version: number, startEditable: boolean): EditorState<any>;
export declare function createEditorView(dom: HTMLDivElement, state: EditorState, dispatch: (tr: Transaction) => void): EditorView;
