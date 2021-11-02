import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
export declare function getPlugins(schema: Schema, stateKey: any, version: number, startEditable: boolean): Plugin[];
export declare function getInlinePlugins(schema: Schema): Plugin[];
