import { Node as ProsemirrorNode, Mark, Node } from 'prosemirror-model';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import { MdSerializerState } from '../types';

export type MarkSerializerMethod = (
  state: MarkdownSerializerState,
  mark: Mark,
  parent: Node,
  index: number,
) => void;

declare type MarkSerializerSpec = {
  /**
    The string that should appear before a piece of content marked
    by this mark, either directly or as a function that returns an
    appropriate string.
    */
  open:
    | string
    | ((state: MarkdownSerializerState, mark: Mark, parent: Node, index: number) => string);
  /**
    The string that should appear after a piece of content marked by
    this mark.
    */
  close:
    | string
    | ((state: MarkdownSerializerState, mark: Mark, parent: Node, index: number) => string);
  /**
    When `true`, this indicates that the order in which the mark's
    opening and closing syntax appears relative to other mixable
    marks can be varied. (For example, you can say `**a *b***` and
    `*a **b***`, but not `` `a *b*` ``.)
    */
  mixable?: boolean;
  /**
    When enabled, causes the serializer to move enclosing whitespace
    from inside the marks to outside the marks. This is necessary
    for emphasis marks as CommonMark does not permit enclosing
    whitespace inside emphasis marks, see:
    http:spec.commonmark.org/0.26/#example-330
    */
  expelEnclosingWhitespace?: boolean;
  /**
    Can be set to `false` to disable character escaping in a mark. A
    non-escaping mark has to have the highest precedence (must
    always be the innermost mark).
    */
  escape?: boolean;
};

// Taken from https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/to_markdown.js
// MIT License https://github.com/ProseMirror/prosemirror-markdown/blob/master/LICENSE

export function backticksFor(node: ProsemirrorNode, side: number) {
  const ticks = /`+/g;
  let m;
  let len = 0;
  if (node.isText) {
    // eslint-disable-next-line no-cond-assign
    while ((m = ticks.exec(node.text ?? ''))) len = Math.max(len, m[0].length);
  }
  let result = len > 0 && side > 0 ? ' `' : '`';
  for (let i = 0; i < len; i += 1) result += '`';
  if (len > 0 && side < 0) result += ' ';
  return result;
}

export function isPlainURL(link: Mark, href: string, parent: Node, index: number, side: number) {
  if (link.attrs.title || !/^\w+:/.test(href)) return false;
  const content = parent.child(index + (side < 0 ? -1 : 0));
  if (!content.isText || content.text !== href || content.marks[content.marks.length - 1] !== link)
    return false;
  if (index === (side < 0 ? 1 : parent.childCount - 1)) return true;
  const next = parent.child(index + (side < 0 ? -2 : 1));
  return !link.isInSet(next.marks);
}

export function wrapMark(token: string, close?: MarkSerializerMethod): MarkSerializerSpec {
  return {
    open(_state, _mark, parent, index) {
      return `{${token}}${backticksFor(parent.child(index), -1)}`;
    },
    close(_state, _mark, parent, index) {
      const extra = close ? close(_state, _mark, parent, index) : '';
      return `${extra}${backticksFor(parent.child(index - 1), 1)}`;
    },
  };
}

export function writeDirectiveOptions(state: MdSerializerState, options: Record<string, any>) {
  const entries = Object.entries(options)
    .filter(([, v]) => v)
    .map(([k, v]) => `:${k}: ${v}\n`);
  entries.forEach((opt, index) => {
    state.write(index === entries.length - 1 ? `${opt}\n` : opt);
  });
}
