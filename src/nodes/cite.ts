import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import { NodeGroups, MyNodeSpec, ReferenceKind } from './types';

export type Attrs = {
  key: string | null;
  kind: ReferenceKind;
  label: string | null;
  text: string | null;
  title: string | null;
};

type Legacy = { inline: undefined };

const cite: MyNodeSpec<Attrs & Legacy> = {
  attrs: {
    key: { default: null },
    title: { default: '' },
    kind: { default: null },
    label: { default: null },
    // TODO: This has been renamed to text - need to deprecate
    inline: { default: null },
    text: { default: '' },
  },
  inline: true,
  marks: '',
  group: NodeGroups.inline,
  draggable: true,
  parseDOM: [
    {
      tag: 'cite',
      getAttrs(dom: any) {
        return {
          key:
            dom.getAttribute('key') ??
            dom.getAttribute('data-key') ??
            dom.getAttribute('data-cite'),
          title: dom.getAttribute('title') ?? '',
          kind: dom.getAttribute('kind') || 'cite',
          label: dom.getAttribute('label') || null,
          // inline is for legacy
          inline: undefined,
          text: dom.getAttribute('inline') ?? dom.textContent ?? '',
        };
      },
    },
  ],
  toDOM(node) {
    const { key, kind, text, label, title } = node.attrs as Attrs;
    return [
      'cite',
      {
        key: key || undefined,
        kind: kind ?? 'cite',
        title: title || undefined,
        label: label || undefined,
      },
      text || '',
    ];
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  const { kind, key, text } = node.attrs as Attrs;
  switch (kind) {
    case ReferenceKind.cite: {
      const citeKey = state.options.localizeCitation?.(key ?? '') ?? key ?? '';
      state.write(`{cite}\`${citeKey}\``);
      return;
    }
    case ReferenceKind.sec:
    case ReferenceKind.fig:
    case ReferenceKind.eq:
    case ReferenceKind.table:
    case ReferenceKind.code:
    default: {
      const id = state.options.localizeId?.(key ?? '') ?? key;
      state.write(`{numref}\`${text} %s <${id}>\``);
    }
  }
};

export const toTex: TexFormatSerialize = (state, node) => {
  const { kind, text, key } = node.attrs as Attrs;
  let prepend = '';
  switch (kind) {
    case ReferenceKind.cite: {
      const citeKey = state.options.localizeCitation?.(key ?? '') ?? key ?? '';
      if (state.nextCitationInGroup) {
        state.write(state.nextCitationInGroup > 1 ? `${citeKey}, ` : citeKey);
        state.nextCitationInGroup -= 1;
      } else {
        state.write(`\\cite{${citeKey}}`);
      }
      return;
    }
    case ReferenceKind.sec:
      prepend = 'Section~';
      break;
    case ReferenceKind.fig:
      prepend = 'Figure~';
      break;
    case ReferenceKind.eq:
      prepend = 'Equation~';
      break;
    case ReferenceKind.table:
      prepend = 'Table~';
      break;
    case ReferenceKind.code:
      prepend = 'Program~';
      break;
    default:
      prepend = `${text}~`;
  }
  const id = state.options.localizeId?.(key ?? '') ?? key;
  if (id) state.write(`${prepend}\\ref{${id}}`);
};

export default cite;
