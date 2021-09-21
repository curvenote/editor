import { NodeSelection, EditorState, Selection } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { findParentNode, isNodeSelection } from 'prosemirror-utils';
import { nodeNames } from '@curvenote/schema';
import { getLinkBoundsIfTheyExist } from '../actions/utils';
import { SelectionKinds } from './types';

export function getNodeFromSelection(selection?: Selection) {
  if (!selection || !isNodeSelection(selection)) return null;
  const nodeSelection = selection as NodeSelection;
  return nodeSelection.node;
}

export function getNodeIfSelected(state: EditorState | null, nodeName?: nodeNames) {
  if (state == null) return null;
  const node = getNodeFromSelection(state.selection);
  if (node && (!nodeName || node.type.name === nodeName)) {
    return node;
  }
  return null;
}

export const getSelectionKind = (
  state: EditorState | null,
): { kind: SelectionKinds; pos: number } | null => {
  if (state == null) return null;
  // Marks first
  const linkBounds = getLinkBoundsIfTheyExist(state);
  if (linkBounds) return { kind: SelectionKinds.link, pos: linkBounds.from };
  // Then selected nodes
  const node = getNodeFromSelection(state.selection);
  const pos = state.selection.from;
  switch (node?.type.name as nodeNames | undefined) {
    case nodeNames.image:
      return { kind: SelectionKinds.image, pos };
    case nodeNames.iframe:
      return { kind: SelectionKinds.iframe, pos };
    case nodeNames.math:
      return { kind: SelectionKinds.math, pos };
    case nodeNames.equation:
      return { kind: SelectionKinds.equation, pos };
    case nodeNames.cite:
      return { kind: SelectionKinds.cite, pos };
    case nodeNames.time:
      return { kind: SelectionKinds.time, pos };
    case nodeNames.callout:
      return { kind: SelectionKinds.callout, pos };
    case nodeNames.heading:
      return { kind: SelectionKinds.heading, pos };
    default:
      break;
  }
  // Then find if there are any parents
  const parent = findParentNode((n: Node) => {
    switch (n?.type.name as nodeNames | undefined) {
      case nodeNames.heading: {
        // Only if the whole header is selected
        const {
          $from: {
            parentOffset: from,
            parent: { nodeSize },
          },
          $to: { parentOffset: to },
        } = state.selection;
        return from === 0 && to === nodeSize - 2;
      }
      case nodeNames.callout:
        return true;
      case nodeNames.table:
        return true;
      default:
        return false;
    }
  })(state.selection);
  if (!parent) return null;
  // Return the parent position / selections if appropriate
  switch (parent.node?.type.name as nodeNames) {
    case nodeNames.heading:
      return { kind: SelectionKinds.heading, pos: parent.pos };
    case nodeNames.callout:
      return { kind: SelectionKinds.callout, pos: parent.pos };
    case nodeNames.table:
      return { kind: SelectionKinds.table, pos: parent.pos };
    default:
      break;
  }
  return null;
};
