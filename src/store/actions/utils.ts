import { NodeType } from 'prosemirror-model';
import { EditorState, NodeSelection, TextSelection, Transaction } from 'prosemirror-state';
import { ContentNodeWithPos, findChildrenByType } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';

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

export function selectFirstNodeOfTypeInParent(
  nodeType: NodeType,
  tr: Transaction,
  parentPos: number,
): Transaction {
  const pos = tr.doc.resolve(parentPos);
  const parent = pos.nodeAfter;
  if (!parent) return tr;
  const node = findChildrenByType(parent, nodeType)[0];
  if (!node) return tr;
  const start = parentPos + 1;
  try {
    const selected = tr
      .setSelection(NodeSelection.create(tr.doc, start + node.pos))
      .scrollIntoView();
    return selected;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Could not select the ${nodeType.name} node.`);
    return tr;
  }
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
