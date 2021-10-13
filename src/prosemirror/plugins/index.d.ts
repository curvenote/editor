import { Schema } from 'prosemirror-model';
export declare function getPlugins(schema: Schema, stateKey: any, version: number, startEditable: boolean): (import("prosemirror-state").Plugin<any, any> | import("prosemirror-state").Plugin<import("./comments").CommentState, any> | import("prosemirror-state").Plugin<import("prosemirror-view").DecorationSet<any>, any>)[];
export declare function getInlinePlugins(schema: Schema): (import("prosemirror-state").Plugin<any, any> | import("prosemirror-state").Plugin<import("./comments").CommentState, any>)[];
