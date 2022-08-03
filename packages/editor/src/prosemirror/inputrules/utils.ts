import { InputRule } from 'prosemirror-inputrules';
import { NodeType, MarkType, Node } from 'prosemirror-model';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { findParentNode } from '@curvenote/prosemirror-utils';

type GetAttrs =
  | {
      content?: Node;
      [key: string]: any;
    }
  | ((p: string[]) => { content?: Node; [key: string]: any });

// https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/11
export function markInputRule(
  regexp: RegExp,
  markType: MarkType,
  options?: {
    getAttrs?: GetAttrs;
    getText?: (p: string[]) => string;
    getTextAfter?: ((p: string[]) => string) | string;
  },
) {
  return new InputRule(regexp, (state, match, start, end) => {
    // Always give up on the input rules that go into math text...
    const parent = findParentNode((n: Node) => n.type === state.schema.nodes.math)(
      TextSelection.create(state.doc, start, end),
    );
    if (parent?.node) return null;
    const { getAttrs, getText, getTextAfter } = options ?? {};
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const textAfter = getTextAfter instanceof Function ? getTextAfter(match) : getTextAfter;
    const { tr } = state;
    if (state.doc.rangeHasMark(start, end, markType)) {
      return null;
    }
    const mark = markType.create(attrs);
    tr.delete(start, end);
    const text = getText?.(match) ?? match[1];
    tr.insertText(text);
    tr.addMark(start, start + text.length, mark);
    tr.removeStoredMark(markType);
    if (textAfter) tr.insertText(textAfter);
    return tr;
  });
}

export function replaceNodeRule(
  regExp: RegExp,
  nodeType: NodeType,
  getAttrs?: GetAttrs,
  select: boolean | ((p: string[]) => boolean) = false,
  test?: (p: string[]) => boolean,
) {
  // return textblockTypeInputRule(/^\$\$\s$/, nodeType);
  return new InputRule(regExp, (state, match, start, end) => {
    if (test && !test(match)) return null;
    const { content, ...attrs } = (getAttrs instanceof Function ? getAttrs(match) : getAttrs) ?? {};
    const tr = state.tr
      .delete(start, end)
      .replaceSelectionWith(nodeType.create(attrs, content), false)
      .scrollIntoView();
    const doSelect = select instanceof Function ? select(match) : select;
    if (!doSelect) return tr;
    const nodeSize = tr.selection.$anchor.nodeBefore?.nodeSize ?? 0;
    const resolvedPos = tr.doc.resolve(tr.selection.anchor - nodeSize);
    const selected = tr.setSelection(new NodeSelection(resolvedPos));
    return selected;
  });
}

export function changeNodeRule(regExp: RegExp, nodeType: NodeType, getAttrs?: GetAttrs) {
  return new InputRule(regExp, (state, match, start, end) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content, ...attrs } = (getAttrs instanceof Function ? getAttrs(match) : getAttrs) ?? {};
    const tr = state.tr
      .delete(start, end)
      .setNodeMarkup(state.selection.$from.before(), nodeType, attrs)
      .scrollIntoView();
    const selected = tr.setSelection(NodeSelection.create(tr.doc, tr.selection.$from.before()));
    return selected;
  });
}
