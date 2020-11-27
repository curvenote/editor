import { InputRule } from 'prosemirror-inputrules';
import { NodeType, MarkType, Node } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';

type GetAttrs = {
  content?: Node<any>;[key: string]: any;
} | ((p: string[]) => { content?: Node<any>;[key: string]: any });

// https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/11
export function markInputRule(regexp: RegExp, markType: MarkType, getAttrs?: GetAttrs) {
  return new InputRule(regexp, (state, match, start, end) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const { tr } = state;
    if (state.doc.rangeHasMark(start, end, markType)) {
      return null;
    }
    if (match[1]) {
      const textStart = start + match[0].indexOf(match[1]);
      const textEnd = textStart + match[1].length;
      if (textEnd < end) tr.delete(textEnd, end);
      if (textStart > start) tr.delete(start, textStart);
      // eslint-disable-next-line no-param-reassign
      end = start + match[1].length;
    }
    const mark = markType.create(attrs);
    tr.addMark(start, end, mark);
    tr.removeStoredMark(markType);
    tr.insertText(' ');
    return tr;
  });
}

export function insertNodeRule(
  regExp: RegExp, nodeType: NodeType, getAttrs?: GetAttrs,
  select: boolean | ((p: string[]) => boolean) = false,
) {
  // return textblockTypeInputRule(/^\$\$\s$/, nodeType);
  return new InputRule(regExp, (state, match, start, end) => {
    const { content, ...attrs } = (getAttrs instanceof Function ? getAttrs(match) : getAttrs) ?? {};
    const tr = state.tr.delete(start, end).replaceSelectionWith(
      nodeType.create(attrs, content), false,
    ).scrollIntoView();
    const doSelect = select instanceof Function ? select(match) : select;
    if (!doSelect) return tr;
    const nodeSize = tr.selection.$anchor.nodeBefore?.nodeSize ?? 0;
    const resolvedPos = tr.doc.resolve(tr.selection.anchor - nodeSize);
    const selected = tr.setSelection(new NodeSelection(resolvedPos));
    return selected;
  });
}
