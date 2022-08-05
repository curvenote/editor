import type { EditorState } from 'prosemirror-state';
import { count as wordcount } from '@wordpress/wordcount';
import type * as Nodes from '../nodes';
import type { NumberedNode } from '../nodes/types';
import { ReferenceKind } from '../nodes/types';
import { nodeNames } from '../types';
import { toText } from '../serialize/text';
import type { Counter, CounterMeta, Reference, StateCounter, WordCounter } from './types';
import { findChildrenWithName } from '../utils';

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
    counter.total += 1;
  }
}

const NO_CAPTION: NumberedNode = { numbered: false, id: null, label: null };

export function countState(state: EditorState): StateCounter {
  const counts: StateCounter = {
    [ReferenceKind.sec]: { kind: ReferenceKind.sec, total: 0, all: [] },
    [ReferenceKind.fig]: { kind: ReferenceKind.fig, total: 0, all: [] },
    [ReferenceKind.eq]: { kind: ReferenceKind.eq, total: 0, all: [] },
    [ReferenceKind.code]: { kind: ReferenceKind.code, total: 0, all: [] },
    [ReferenceKind.table]: { kind: ReferenceKind.table, total: 0, all: [] },
    [ReferenceKind.link]: { kind: ReferenceKind.link, total: 0, all: [] },
    [ReferenceKind.cite]: { kind: ReferenceKind.cite, total: 0, all: [] },
  };
  let tableCounted = false;
  state.doc.content.descendants((node) => {
    switch (node.type.name) {
      case nodeNames.cite: {
        const { kind, key } = node.attrs as Nodes.Cite.Attrs;
        if (kind === ReferenceKind.cite) {
          const attrs = node.attrs as Nodes.Cite.Attrs;
          push(counts.cite, { numbered: true, id: null, label: null }, attrs.title || '', {
            key,
          });
        }
        return false;
      }
      case nodeNames.image: {
        const { src, alt } = node.attrs as Nodes.Image.Attrs;
        push(counts.fig, NO_CAPTION, alt, { src, alt });
        return false;
      }
      case nodeNames.code_block: {
        const { title, language } = node.attrs as Nodes.Code.Attrs;
        const code = toText(node);
        push(counts.code, NO_CAPTION, title, { code, language });
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
        return true;
      }
      case nodeNames.table: {
        if (!tableCounted) push(counts.table, NO_CAPTION, '', {});
        tableCounted = false;
        // There are children of tables to be counted
        return true;
      }
      // Continue to search
      case nodeNames.figure: {
        const child = findChildrenWithName(node, [
          nodeNames.image,
          nodeNames.iframe,
          nodeNames.table,
          nodeNames.code_block,
          nodeNames.equation,
        ])[0];
        if (!child) return false;
        const caption = findChildrenWithName(node, nodeNames.figcaption)[0];
        const { numbered: isNumbered, id, label } = node.attrs as Nodes.Figure.Attrs;
        const numbered = caption && isNumbered;
        const captionText = caption?.node ? toText(caption.node) : '';
        switch (child.node.type.name) {
          case nodeNames.image: {
            const { alt, src } = child.node.attrs as Nodes.Image.Attrs;
            push(counts.fig, { numbered, id, label }, captionText ?? alt, {
              src,
              alt,
            });
            return false;
          }
          case nodeNames.iframe: {
            const { src } = child.node.attrs as Nodes.IFrame.Attrs;
            push(counts.fig, { numbered, id, label }, captionText, {
              src,
              alt: '',
            });
            return false;
          }
          case nodeNames.table: {
            push(counts.table, { numbered, id, label }, captionText, {});
            // There are children of tables to be counted
            tableCounted = true;
            return true;
          }
          case nodeNames.equation: {
            const math = toText(child.node);
            push(counts.eq, { numbered, id, label }, captionText, { math });
            // There are children of tables to be counted
            return false;
          }
          case nodeNames.code_block: {
            const { title, language } = child.node.attrs as Nodes.Code.Attrs;
            const code = toText(child.node);
            push(counts.code, { numbered, id, label }, captionText ?? title, {
              code,
              language,
            });
            // There are children of tables to be counted
            return false;
          }
          default:
            break;
        }
        return false;
      }
      default:
        return true;
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
