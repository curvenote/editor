import { nodeNames } from '@curvenote/schema';
import { Schema } from 'prosemirror-model';
import { EditorState, NodeSelection, TextSelection, Transaction } from 'prosemirror-state';
import { findParentNode, findParentNodeOfType } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { KeyMap } from './types';

function insertParagraphAndSelect(view: EditorView, side: number) {
  const transaction = view.state.tr.insert(
    side,
    view.state.schema.nodes[nodeNames.paragraph].createAndFill(),
  );
  transaction.setSelection(TextSelection.create(transaction.doc, side + 1));
  return transaction;
}

function selectParent(view: EditorView, start: number) {
  view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, start - 1))); // -1 to select the parent node instead of the beginning of the parentnode
}

export const handleBackspace: KeyMap = function handleBackspace(
  state,
  dispatch,
  view?: EditorView,
) {
  const { $head } = state.selection;
  const parent = findParentNode(() => true)(state.selection);
  if (parent) {
    const possibleFigure = state.doc.resolve(parent.pos).nodeBefore;
    if (possibleFigure?.type.name === nodeNames.figure) {
      const figPos = parent.pos - possibleFigure.nodeSize;
      dispatch?.(state.tr.setSelection(NodeSelection.create(state.doc, figPos)));
      return true;
    }
  }
  if ($head.parent.type.name === nodeNames.figcaption) {
    const figcaption = $head.parent;
    const figure = $head.node($head.depth - 1);
    if (figure.type.name !== nodeNames.figure) {
      return false;
    }

    if (!view || !dispatch) {
      return false;
    }

    if ($head.parentOffset === 0) {
      const found = findParentNodeOfType(state.schema.nodes[nodeNames.figure])(state.selection);
      if (found) {
        dispatch(state.tr.setSelection(NodeSelection.create(state.doc, found.pos)));
        return true;
      }
    }
  }
  return false;
};

export const handleEnterCommand: KeyMap = function handleEnterCommand(
  state: EditorState,
  dispatch?: (p: Transaction<Schema>) => void,
  view?: EditorView,
) {
  const { $head } = state.selection;
  if (!view || !dispatch) return false;
  if ($head.parent.type.name === nodeNames.figure) {
    view.dispatch(insertParagraphAndSelect(view, $head.end() + $head.depth));
    return true;
  }
  if ($head.parent.type.name !== nodeNames.figcaption) return false;
  // We are in a figure caption!!
  const figure = $head.node($head.depth - 1);
  if (figure.type.name !== nodeNames.figure) {
    return false;
  }

  const found = findParentNodeOfType(state.schema.nodes[nodeNames.figure])(state.selection);

  if (!found) {
    return false;
  }
  if (found.pos + found.node.nodeSize === $head.pos + $head.depth) {
    view.dispatch(insertParagraphAndSelect(view, $head.end() + $head.depth));
    return true;
  }
  if (found.start === $head.pos - 1) {
    view.dispatch(insertParagraphAndSelect(view, $head.start() - $head.depth));
    return true;
  }
  selectParent(view, $head.start());
  return true;
};
