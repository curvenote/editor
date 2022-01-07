import { Node as ProsemirrorNode, Mark, Fragment } from 'prosemirror-model';
import { MarkSerializerConfig, MarkSerializerMethod } from 'prosemirror-markdown';
import { MdSerializerState } from '../types';

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

export function isPlainURL(
  link: Mark,
  href: string,
  parent: Fragment,
  index: number,
  side: number,
) {
  if (link.attrs.title || !/^\w+:/.test(href)) return false;
  const content = parent.child(index + (side < 0 ? -1 : 0));
  if (!content.isText || content.text !== href || content.marks[content.marks.length - 1] !== link)
    return false;
  if (index === (side < 0 ? 1 : parent.childCount - 1)) return true;
  const next = parent.child(index + (side < 0 ? -2 : 1));
  return !link.isInSet(next.marks);
}

export function wrapMark(token: string, close?: MarkSerializerMethod): MarkSerializerConfig {
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
