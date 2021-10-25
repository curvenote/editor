import { nodeNames } from '@curvenote/schema';
import { findParentNode, findChildrenByType } from 'prosemirror-utils';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export type ActionProps = {
  stateId: any;
  viewId: string | null;
};

let popper: { update: () => void } | null = null;

export function registerPopper(next: typeof popper) {
  popper = next;
}

export function positionPopper() {
  popper?.update();
}

export function getFigure(editorState: EditorState | null) {
  if (!editorState) {
    return { figure: undefined, figcaption: undefined };
  }
  const { selection } = editorState;
  const figure =
    selection && findParentNode((n: Node) => n.type.name === nodeNames.figure)(selection);
  const figcaption = figure
    ? findChildrenByType(figure?.node, editorState.schema.nodes[nodeNames.figcaption])[0]
    : undefined;

  return { figure, figcaption };
}
