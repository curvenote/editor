import { nodeNames, CaptionKind, createId, Nodes, findChildrenWithName } from '@curvenote/schema';
import { EditorState, NodeSelection, TextSelection, Transaction } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import { determineCaptionKind } from '@curvenote/schema/dist/process';
import { Fragment, Node, NodeType, Schema } from 'prosemirror-model';
import { opts } from '../../connect';
import { insertInlineNode } from './editor';

export const TEST_LINK =
  /((https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))$/;
export const TEST_LINK_WEAK =
  /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))$/;
export const TEST_LINK_SPACE =
  /((https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))\s$/;
export const TEST_LINK_COMMON_SPACE =
  /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[com|org|app|dev|io|net|gov|edu]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))\s$/;

export const testLink = (possibleLink: string) => {
  const match = TEST_LINK.exec(possibleLink);
  return Boolean(match);
};
export const testLinkWeak = (possibleLink: string) => {
  const match = TEST_LINK_WEAK.exec(possibleLink);
  return Boolean(match);
};

export const addLink = (view: EditorView, data: DataTransfer | null) => {
  // TODO: This should allow html if it exists. And not match mutliple URLs.
  const href = data?.getData('text/plain') ?? '';
  if (!testLink(href)) return false;
  const { schema } = view.state;
  const node = schema.text(href, [schema.marks.link.create({ href })]);
  const tr = view.state.tr.replaceSelectionWith(node, false).scrollIntoView();
  view.dispatch(tr);
  return true;
};

export const addLinkBlock = (view: EditorView, data: DataTransfer | null) => {
  const html = data?.getData('text/html') ?? '';
  if (!html.includes('<a data-url')) return false;
  const tempBoard = document.createElement('div');
  tempBoard.innerHTML = html;
  const anchor = tempBoard.querySelector('a');
  if (!anchor) return false;
  const url = anchor.getAttribute('data-url');
  const title = anchor.getAttribute('title');
  const description = anchor.innerText;
  if (!url) return false;
  const node = view.state.schema.nodes.link_block.createAndFill({
    url,
    title,
    description,
  });
  const tr = view.state.tr.replaceSelectionWith(node, false).scrollIntoView();
  view.dispatch(tr);
  return true;
};

export function updateNodeAttrsOnView(
  view: EditorView | null,
  node: Pick<ContentNodeWithPos, 'node' | 'pos'>,
  attrs: { [index: string]: any },
  select: boolean | 'after' = true,
) {
  if (view == null) return;
  const tr = view.state.tr.setNodeMarkup(node.pos, undefined, { ...node.node.attrs, ...attrs });
  if (select === true) tr.setSelection(NodeSelection.create(tr.doc, node.pos));
  if (select === 'after') {
    const sel = TextSelection.create(tr.doc, node.pos + node.node.nodeSize);
    tr.setSelection(sel);
  }
  view.dispatch(tr);
  view.focus();
}

export function createFigureCaption(schema: Schema, kind: CaptionKind, src?: string) {
  const FigcaptionNode = schema.nodes[nodeNames.figcaption];
  const fragment = src ? opts.getCaptionFragment(schema, src) : Fragment.empty;
  const captionAttrs: Nodes.Figcaption.Attrs = { kind };
  const caption = FigcaptionNode.create(captionAttrs, fragment);
  return caption;
}

export function createFigure(
  schema: Schema,
  node: Node,
  caption = false,
  initialFigureState: Partial<Nodes.Figure.Attrs> = {},
) {
  const Figure = schema.nodes[nodeNames.figure] as NodeType;
  const kind = determineCaptionKind(node) ?? CaptionKind.fig;
  const attrs: Nodes.Figure.Attrs = {
    id: createId(),
    label: null,
    numbered: true,
    align: 'center',
    ...initialFigureState,
    multipage: initialFigureState.multipage ?? false,
    landscape: initialFigureState.landscape ?? false,
    fullpage: initialFigureState.fullpage ?? false,
  };
  if (!caption) {
    const figure = Figure.createAndFill(attrs, Fragment.fromArray([node])) as Node;
    return figure;
  }
  const captionNode = createFigureCaption(schema, kind, node.attrs.src);
  const captionFirst = kind === CaptionKind.table;
  const figure = Figure.createAndFill(
    attrs,
    Fragment.fromArray(captionFirst ? [captionNode, node] : [node, captionNode]),
  ) as Node;
  return figure;
}

export function selectFirstNodeOfTypeInParent(
  nodeName: nodeNames | nodeNames[],
  tr: Transaction,
  parentPos: number,
): Transaction {
  const pos = tr.doc.resolve(parentPos);
  const parent = pos.nodeAfter;
  if (!parent) return tr;
  const node = findChildrenWithName(parent, nodeName)[0];
  if (!node) return tr;
  const start = parentPos + 1;
  try {
    const selected = tr
      .setSelection(NodeSelection.create(tr.doc, start + node.pos))
      .scrollIntoView();
    return selected;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Could not select the ${typeof nodeName === 'string' ? nodeName : nodeName.join(', ')} node.`,
    );
    return tr;
  }
}

export function insertParagraphAndSelect(schema: Schema, tr: Transaction, side: number) {
  const paragraph = schema.nodes[nodeNames.paragraph].createAndFill() as Node;
  const next = tr.insert(side, paragraph);
  next.setSelection(TextSelection.create(next.doc, side + 1)).scrollIntoView();
  return next;
}

// https://discuss.prosemirror.net/t/expanding-the-selection-to-the-active-mark/478
function getLinkBounds(state: EditorState, pos: number) {
  const $pos = state.doc.resolve(pos);

  const { parent, parentOffset } = $pos;
  const start = parent.childAfter(parentOffset);
  if (!start.node) return null;

  const link = start.node.marks.find((mark) => mark.type === state.schema.marks.link);
  if (!link) return null;

  let startIndex = $pos.index();
  let startPos = $pos.start() + start.offset;
  let endIndex = startIndex + 1;
  let endPos = startPos + start.node.nodeSize;
  while (startIndex > 0 && link.isInSet(parent.child(startIndex - 1).marks)) {
    startIndex -= 1;
    startPos -= parent.child(startIndex).nodeSize;
  }
  while (endIndex < parent.childCount && link.isInSet(parent.child(endIndex).marks)) {
    endPos += parent.child(endIndex).nodeSize;
    endIndex += 1;
  }
  return { from: startPos, to: endPos, mark: link };
}

export function getLinkBoundsIfTheyExist(state?: EditorState | null, pos?: number) {
  if (!state) return null;
  let { from, $from, to, $to, empty } = state.selection;
  if (pos != null) {
    from = pos;
    $from = state.doc.resolve(pos);
    $to = $from;
    to = pos;
    empty = true;
  }
  const mark = state.schema.marks.link;
  const searchForLink = empty
    ? Boolean(mark.isInSet(state.storedMarks || $from.marks()))
    : state.doc.rangeHasMark(from, to, mark);

  const linkBounds = searchForLink ? getLinkBounds(state, from) : null;

  const hasLink = Boolean(
    (mark.isInSet($from.marks()) || from === linkBounds?.from) &&
      (mark.isInSet($to.marks()) || to === linkBounds?.to),
  );

  // TODO: this fails if you are selecting between TWO different links. :(
  // TODO: this fails if the link is only one character long.

  if (!hasLink || !linkBounds) return null;
  return linkBounds;
}
