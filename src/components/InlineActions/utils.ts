import { CaptionKind, createId, nodeNames, Nodes } from '@curvenote/schema';
import { Fragment, Schema } from 'prosemirror-model';
import { opts } from '../../connect';

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

export function createFigureCaption(schema: Schema, kind: CaptionKind, src?: string) {
  const FigcaptionNode = schema.nodes[nodeNames.figcaption];
  const fragment = src ? opts.getCaptionFragment(schema, src) : Fragment.empty;
  const captionAttrs: Nodes.Figcaption.Attrs = {
    kind,
    id: createId(),
    label: null,
    numbered: true,
  };
  const caption = FigcaptionNode.create(captionAttrs, fragment);
  return caption;
}
