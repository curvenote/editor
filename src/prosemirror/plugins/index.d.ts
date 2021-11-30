import { Schema } from 'prosemirror-model';
import { schemas } from '@curvenote/schema';
import { Plugin } from 'prosemirror-state';
export declare function getPlugins(schemaPreset: schemas.UseSchema, schema: Schema, stateKey: any, version: number, startEditable: boolean): Plugin[];
export declare function getInlinePlugins(schema: Schema): Plugin[];
