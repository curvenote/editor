import { Schema } from 'prosemirror-model';
import { Keymap } from './utils';
export declare function buildBasicKeymap(schema: Schema): Keymap;
export declare function buildCommentKeymap(stateKey: any, schema: Schema): Keymap;
export declare function buildKeymap(stateKey: any, schema: Schema): Keymap;
export declare function captureTab(): Keymap;
