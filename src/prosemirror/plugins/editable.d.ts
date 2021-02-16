import { Plugin, EditorState, Transaction } from 'prosemirror-state';
export declare const isEditable: (state?: EditorState<any> | null | undefined) => boolean;
export declare const setEditable: (state: EditorState, tr: Transaction, editable: boolean) => Transaction;
export declare const editablePlugin: (startEditable: boolean) => Plugin;
