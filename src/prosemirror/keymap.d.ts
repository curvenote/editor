import { Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
declare type KeyMap = (state: EditorState<Schema>, dispatch?: (p: Transaction<Schema>) => void) => boolean;
export declare function buildBasicKeymap(schema: Schema, bind?: (key: string, cmd: KeyMap) => void): {
    [index: string]: KeyMap;
};
export declare function buildKeymap(stateKey: any, schema: Schema): {
    [index: string]: KeyMap;
};
export declare function captureTab(): {
    'Shift-Tab': KeyMap;
    Tab: KeyMap;
};
export {};
