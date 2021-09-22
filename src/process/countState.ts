import { EditorState } from 'prosemirror-state';
import { count as wordcount } from '@wordpress/wordcount';
import * as Nodes from '../nodes';
import { NumberedNode, ReferenceKind } from '../nodes/types';
import { nodeNames } from '../types';
import { toText } from '../serialize/text';
import { StateCounter, Reference, Counter, CounterMeta, WordCounter } from './types';

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

export function countState(state: EditorState): StateCounter {
  const counts: StateCounter = {
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
        const code = toText(node);
        push(counts.code, attrs, title, { code, language });
        return false;
      }
      case nodeNames.equation: {
        const attrs = node.attrs as Nodes.Equation.Attrs;
        const { title } = attrs;
        const math = toText(node);
        push(counts.eq, attrs, title, { math });
        return false;
      }
      case nodeNames.heading: {
        const attrs = node.attrs as Nodes.Heading.Attrs;
        const { level } = node.attrs;
        const title = toText(node);
        push(counts.sec, attrs, title, { level, section: '' });
        return false;
      }
      case nodeNames.table: {
        const attrs: NumberedNode = { numbered: false, id: null, label: null };
        push(counts.table, attrs, '', {});
        // There are children of tables to be counted
        return true;
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

export function countWords(state: EditorState): WordCounter {
  const text = toText(state.doc);
  const words = wordcount(text, 'words');
  const characters_excluding_spaces = wordcount(text, 'characters_excluding_spaces');
  const characters_including_spaces = wordcount(text, 'characters_including_spaces');
  return {
    words,
    characters_excluding_spaces,
    characters_including_spaces,
  };
}
