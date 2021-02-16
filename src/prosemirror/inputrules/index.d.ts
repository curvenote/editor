import { Schema } from 'prosemirror-model';
export * from './rules';
declare const inputrules: (schema: Schema) => import("prosemirror-state").Plugin<unknown, any>;
export default inputrules;
