import { EditorState } from 'prosemirror-state';
import * as Nodes from '../nodes';
import { NumberedNode, ReferenceKind } from '../nodes/types';
import { nodeNames } from '../schemas';
import { toText } from '../serialize/text';
import { StateCounter, Reference, Counter, CounterMeta } from './types';

function push<K extends ReferenceKind, T extends CounterMeta>(
  counter: Counter<Reference<K, T>>,
  attrs: NumberedNode,
  title: string,
  meta: T,
) {
  const number = attrs.numbered ? counter.total + 1 : null;
  counter.all.push({
    id: attrs.id || null,
    kind: counter.kind,
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

export function countState(state: EditorState) {
  const counts: StateCounter = {
    [ReferenceKind.cite]: { kind: ReferenceKind.cite, total: 0, all: [] },
    [ReferenceKind.sec]: { kind: ReferenceKind.sec, total: 0, all: [] },
    [ReferenceKind.fig]: { kind: ReferenceKind.fig, total: 0, all: [] },
    [ReferenceKind.eq]: { kind: ReferenceKind.eq, total: 0, all: [] },
    [ReferenceKind.code]: { kind: ReferenceKind.code, total: 0, all: [] },
    [ReferenceKind.table]: { kind: ReferenceKind.table, total: 0, all: [] },
    [ReferenceKind.link]: { kind: ReferenceKind.link, total: 0, all: [] },
  };
  state.doc.content.descendants((node) => {
    switch (node.type.name) {
      case nodeNames.image: {
        const attrs = node.attrs as Nodes.Image.Attrs;
        const { caption, alt, src } = attrs;
        // Override the numbered prop if the caption is off
        const modifiedAttrs = { ...attrs, numbered: caption ? attrs.numbered : false };
        push(counts.fig, modifiedAttrs, alt, { src, caption });
        return false;
      }
      case nodeNames.code_block: {
        const attrs = node.attrs as Nodes.Code.Attrs;
        const { title, language } = attrs;
        const code = toText(node, state.schema, document);
        push(counts.code, attrs, title, { code, language });
        return false;
      }
      case nodeNames.equation: {
        const attrs = node.attrs as Nodes.Equation.Attrs;
        const { title } = attrs;
        const math = toText(node, state.schema, document);
        push(counts.eq, attrs, title, { math });
        return false;
      }
      case nodeNames.heading: {
        const attrs = node.attrs as Nodes.Heading.Attrs;
        const { level } = node.attrs;
        const title = toText(node, state.schema, document);
        push(counts.sec, attrs, title, { level });
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
