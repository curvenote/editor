import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
export * from './rules';
declare const inputrules: (schema: Schema) => Plugin[];
export default inputrules;
