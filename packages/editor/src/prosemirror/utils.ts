import type { ContentNodeWithPos } from '@curvenote/prosemirror-utils';
import { NodeRange } from 'prosemirror-model';
import { liftTarget } from 'prosemirror-transform';
import type { EditorView } from 'prosemirror-view';

export function deleteNodePM(view: EditorView, node: Pick<ContentNodeWithPos, 'node' | 'pos'>) {
  return view.dispatch(view.state.tr.delete(node.pos, node.pos + node.node.nodeSize));
}
export function updateNodeAttrsPM(
  view: EditorView,
  node: Pick<ContentNodeWithPos, 'node' | 'pos'>,
  attrs: { [index: string]: any },
) {
  const tr = view.state.tr.setNodeMarkup(node.pos, undefined, { ...node.node.attrs, ...attrs });
  view.dispatch(tr);
}
export function liftContentOutOfNodePM(
  view: EditorView,
  node: Pick<ContentNodeWithPos, 'node' | 'pos'>,
) {
  const editorState = view.state;
  const $from = editorState.doc.resolve(node.pos + 1);
  const $to = editorState.doc.resolve(node.pos + node.node.nodeSize - 1);
  const range = new NodeRange($from, $to, $from.depth);
  const target = liftTarget(range);
  if (target == null) return false;
  const tr = editorState.tr.lift(range, target);
  view.dispatch(tr);
}
