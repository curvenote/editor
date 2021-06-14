import { EditorState } from 'prosemirror-state';
import * as Nodes from '../nodes';
import { NumberedNode, RefKind } from '../nodes/types';
import { nodeNames } from '../schemas';
import { toText } from '../serialize/text';

export type CounterMeta = Record<string, string | number | boolean>;

export type Reference<K = RefKind, T = CounterMeta> = {
  id: string | null;
  kind: K;
  label: string | null;
  numbered: boolean;
  number: number | null;
  title: string;
  meta: T;
};

export type Counter<K = RefKind, T = CounterMeta> = {
  kind: K;
  total: number;
  all: Reference<K, T>[];
};

export type StateCounter = {
  headings: Counter<RefKind.sec, { level: number }>;
  figures: Counter<RefKind.fig, { src: string; caption: boolean }>;
  equations: Counter<RefKind.eq, { math: string }>;
  code: Counter<RefKind.code, { code: string }>;
};

export function countState(state: EditorState) {
  const counts: StateCounter = {
    headings: { kind: RefKind.sec, total: 0, all: [] },
    figures: { kind: RefKind.fig, total: 0, all: [] },
    equations: { kind: RefKind.eq, total: 0, all: [] },
    code: { kind: RefKind.code, total: 0, all: [] },
  };
  function push<K, T>(
    kind: K,
    counter: Counter<K, T>,
    attrs: NumberedNode,
    title: string,
    meta: T,
  ) {
    const number = attrs.numbered ? counter.total + 1 : null;
    counter.all.push({
      kind,
      id: attrs.id || null,
      label: attrs.label || null,
      title,
      number,
      numbered: attrs.numbered,
      meta,
    });
    if (number) {
      // eslint-disable-next-line no-param-reassign
      counter.total += 1;
    }
  }
  state.doc.content.descendants((node) => {
    switch (node.type.name) {
      case nodeNames.image: {
        const attrs = node.attrs as Nodes.Image.Attrs;
        const { caption, alt, src } = attrs;
        push(RefKind.fig, counts.figures, attrs, alt, { src, caption });
        return false;
      }
      case nodeNames.code_block: {
        const attrs = node.attrs as Nodes.Code.Attrs;
        const { title } = attrs;
        const code = toText(node, state.schema, document);
        push(RefKind.code, counts.code, attrs, title, { code });
        return false;
      }
      case nodeNames.equation: {
        const attrs = node.attrs as Nodes.Equation.Attrs;
        const { title } = attrs;
        const math = toText(node, state.schema, document);
        push(RefKind.eq, counts.equations, attrs, title, { math });
        return false;
      }
      case nodeNames.heading: {
        const attrs = node.attrs as Nodes.Heading.Attrs;
        const { level } = node.attrs;
        const title = toText(node, state.schema, document);
        push(RefKind.sec, counts.headings, attrs, title, { level });
        return false;
      }
      // Continue to search
      case nodeNames.aside:
      case nodeNames.callout:
        return true;
      default:
        return false;
    }
  });
  return counts;
}
