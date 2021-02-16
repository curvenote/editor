import { Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
declare type KeyMap = (state: EditorState<Schema>, dispatch?: ((p: Transaction<Schema>) => void)) => boolean;
export declare function buildKeymap(stateKey: any, schema: Schema): {
    [index: string]: KeyMap;
};
export {};
