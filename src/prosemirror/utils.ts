import { NodeType } from "prosemirror-model";
import { liftListItem, wrapInList as wrapInListPM } from "prosemirror-schema-list";
import { EditorState, NodeSelection } from "prosemirror-state";
import { ContentNodeWithPos, hasParentNode } from "prosemirror-utils";
import { EditorView } from "prosemirror-view";

export function updateNodeAttrs(
  view: EditorView | null, node: Pick<ContentNodeWithPos, 'node' | 'pos'>, attrs: { [index: string]: any },
) {
  if (view == null) return;
  const tr = view.state.tr.setNodeMarkup(
    node.pos,
    undefined,
    { ...node.node.attrs, ...attrs },
  );
  tr.setSelection(NodeSelection.create(tr.doc, node.pos));
  view.dispatch(tr);
};

