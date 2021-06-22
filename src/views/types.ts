import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export type NodeViewProps = {
  node: Node;
  view: EditorView;
  getPos: () => number;
  open: boolean;
  edit: boolean;
};
