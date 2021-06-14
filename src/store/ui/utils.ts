import { NodeSelection, EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { findParentNode, isNodeSelection } from 'prosemirror-utils';
import { schemas } from '@curvenote/schema';
import { getLinkBoundsIfTheyExist } from '../actions/utils';
import { SelectionKinds } from './types';

export const getSelectionKind = (
  state: EditorState | null,
): { kind: SelectionKinds; pos: number } | null => {
  if (state == null) return null;
  // Marks first
  const linkBounds = getLinkBoundsIfTheyExist(state);
  if (linkBounds) return { kind: SelectionKinds.link, pos: linkBounds.from };
  // Then selected nodes
  const { node } = isNodeSelection(state.selection)
    ? (state.selection as NodeSelection)
    : { node: null };
  const pos = state.selection.from;
  switch (node?.type.name as schemas.nodeNames | undefined) {
    case schemas.nodeNames.image:
      return { kind: SelectionKinds.image, pos };
    case schemas.nodeNames.iframe:
      return { kind: SelectionKinds.iframe, pos };
    case schemas.nodeNames.math:
      return { kind: SelectionKinds.math, pos };
    case schemas.nodeNames.equation:
      return { kind: SelectionKinds.equation, pos };
    case schemas.nodeNames.cite:
      return { kind: SelectionKinds.cite, pos };
    case schemas.nodeNames.time:
      return { kind: SelectionKinds.time, pos };
    case schemas.nodeNames.callout:
      return { kind: SelectionKinds.callout, pos };
    case schemas.nodeNames.heading:
      return { kind: SelectionKinds.heading, pos };
    default:
      break;
  }
  // Then find if there are any parents
  const parent = findParentNode((n: Node) => {
    switch (n?.type.name as schemas.nodeNames | undefined) {
      case schemas.nodeNames.heading: {
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
      case schemas.nodeNames.callout:
        return true;
      default:
        return false;
    }
  })(state.selection);
  if (!parent) return null;
  // Return the parent position / selections if appropriate
  switch (parent.node?.type.name as schemas.nodeNames) {
    case schemas.nodeNames.heading:
      return { kind: SelectionKinds.heading, pos: parent.pos };
    case schemas.nodeNames.callout:
      return { kind: SelectionKinds.callout, pos: parent.pos };
    default:
      break;
  }
  return null;
};
