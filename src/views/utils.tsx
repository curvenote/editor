import { nodeNames } from '@curvenote/schema';
import { Node } from 'prosemirror-model';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils1';
import { EditorView } from 'prosemirror-view';
import { isEditable } from '../prosemirror/plugins/editable';
import { GetPos } from './types';

export function clickSelectFigure(view: EditorView, getPos: GetPos) {
  if (!isEditable(view.state)) return;
  const figure = findParentNode((n: Node) => n.type.name === nodeNames.figure)(
    TextSelection.create(view.state.doc, getPos()),
  );
  if (!figure) return;
  view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, figure.pos)));
}
