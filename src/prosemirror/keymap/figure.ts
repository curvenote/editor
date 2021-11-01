import { nodeNames } from '@curvenote/schema';
import { Command } from 'prosemirror-commands';
import { Schema } from 'prosemirror-model';
import { NodeSelection, Transaction } from 'prosemirror-state';
import { findParentNode, findParentNodeOfType } from 'prosemirror-utils';
import { insertParagraphAndSelect } from '../../store/actions/utils';
import { AddKey } from './utils';

function selectInsideParent(tr: Transaction, pos: number) {
  // -1 to select the parent node instead of the beginning of the parentnode
  return tr.setSelection(NodeSelection.create(tr.doc, pos - 1)).scrollIntoView();
}

const handleEnter: Command = function handleEnter(state, dispatch) {
  const { $head } = state.selection;
  if ($head.parent.type.name === nodeNames.figure) {
    dispatch?.(insertParagraphAndSelect(state.schema, state.tr, $head.end() + $head.depth));
    return true;
  }
  if ($head.parent.type.name !== nodeNames.figcaption) return false;
  // We are in a figure caption!!
  const figure = findParentNodeOfType(state.schema.nodes[nodeNames.figure])(state.selection);
  if (!figure) return false;
  if (!state.selection.empty) {
    // if we have selected text, delete it on enter
    const { from, to } = state.selection;
    dispatch?.(state.tr.deleteRange(from, to));
    return true;
  }
  if (figure.pos + figure.node.nodeSize === $head.pos + $head.depth) {
    dispatch?.(insertParagraphAndSelect(state.schema, state.tr, $head.end() + $head.depth));
    return true;
  }
  if (figure.start === $head.pos - 1) {
    dispatch?.(insertParagraphAndSelect(state.schema, state.tr, $head.start() - $head.depth));
    return true;
  }
  dispatch?.(selectInsideParent(state.tr, $head.start()));
  return true;
};

const deleteBeforeFigure: Command = function deleteBeforeFigure(state, dispatch) {
  // Only fire at the end of a paragraph and if the selection is empty
  const { $head } = state.selection;
  if (!state.selection.empty || $head.parentOffset !== $head.parent.nodeSize - 2) return false;
  const parent = findParentNode(() => true)(state.selection);
  if (!parent) return false;
  if (parent.pos + parent.node.nodeSize + 1 >= state.doc.nodeSize - 1) {
    // Delete at the end of a document:
    return false;
  }
  const possibleFigure = state.doc.resolve(parent.pos + parent.node.nodeSize + 1);
  if (possibleFigure.parent.type.name !== nodeNames.figure) return false;
  let { tr } = state;
  let figPos = parent.pos + parent.node.nodeSize;
  if (parent.node.nodeSize === 2) {
    // If the node is empty, also delete it
    tr = state.tr.delete(parent.pos, parent.pos + parent.node.nodeSize);
    figPos -= parent.node.nodeSize; // Account for the deleted node
  }
  // And then select the figure
  dispatch?.(tr.setSelection(NodeSelection.create(tr.doc, figPos)).scrollIntoView());
  return true;
};

const backspaceAfterFigure: Command = function backspaceAfterFigure(state, dispatch) {
  // Only fire at the start of a paragraph and if the selection is empty
  if (!state.selection.empty || state.selection.$head.parentOffset !== 0) return false;
  const parent = findParentNode(() => true)(state.selection);
  if (!parent) return false;
  const possibleFigure = state.doc.resolve(parent.pos).nodeBefore;
  if (possibleFigure?.type.name !== nodeNames.figure) return false;
  let { tr } = state;
  if (parent.node.nodeSize === 2) {
    // If the node is empty, also delete it
    tr = state.tr.delete(parent.pos, parent.pos + parent.node.nodeSize);
  }
  // And then select the figure
  const figPos = parent.pos - possibleFigure.nodeSize;
  dispatch?.(tr.setSelection(NodeSelection.create(tr.doc, figPos)).scrollIntoView());
  return true;
};

const deleteCaptionAndSelect: Command = function deleteCaptionAndSelect(state, dispatch) {
  const parent = findParentNode(() => true)(state.selection);
  const figure = findParentNodeOfType(state.schema.nodes[nodeNames.figure])(state.selection);
  if (!parent || !figure) return false;
  let { tr } = state;
  if (parent.node.nodeSize === 2) {
    // If the node is empty, also delete it
    tr = state.tr.delete(parent.pos, parent.pos + parent.node.nodeSize);
  }
  dispatch?.(tr.setSelection(NodeSelection.create(tr.doc, figure.pos)).scrollIntoView());
  return true;
};

const backspaceInFigure: Command = function backspaceInFigure(state, dispatch) {
  const { $head } = state.selection;
  if (
    !state.selection.empty ||
    $head.parent.type.name !== nodeNames.figcaption ||
    $head.parentOffset !== 0
  )
    return false;
  return deleteCaptionAndSelect(state, dispatch);
};

const deleteInFigure: Command = function deleteInFigure(state, dispatch) {
  const { $head } = state.selection;
  if (
    !state.selection.empty ||
    $head.parent.type.name !== nodeNames.figcaption ||
    $head.parentOffset !== $head.parent.nodeSize - 2 // only at the end
  )
    return false;
  return deleteCaptionAndSelect(state, dispatch);
};

export function buildFigureKeymap(schema: Schema, bind: AddKey) {
  if (schema.nodes.figure) {
    bind('Enter', handleEnter);
    bind('Backspace', backspaceAfterFigure, backspaceInFigure);
    bind('Delete', deleteBeforeFigure, deleteInFigure);
  }
}
