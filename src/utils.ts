import { MarkType, Node } from 'prosemirror-model';
import { EditorState, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Options } from './types';

export const DEFAULT_ID = 'codemark';
export const MAX_MATCH = 100;
export const pluginKey = new PluginKey(DEFAULT_ID);

export function getMarkType(view: EditorView | EditorState, opts?: Options): MarkType {
  if ('schema' in view) return opts?.markType ?? view.schema.marks.code;
  return opts?.markType ?? view.state.schema.marks.code;
}

export function safeResolve(doc: Node, pos: number) {
  return doc.resolve(Math.min(Math.max(1, pos), doc.nodeSize - 2));
}
