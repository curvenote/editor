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
  attrsFromMdastToken: () => ({
    key: null,
    kind: ReferenceKind.cite,
    label: null,
    title: null,
    inline: undefined,
    text: '',
  }),
};

function getPrependedText(kind: ReferenceKind): string {
  switch (kind) {
    case ReferenceKind.sec:
      return 'Section';
    case ReferenceKind.fig:
      return 'Figure';
    case ReferenceKind.eq:
      return 'Equation';
    case ReferenceKind.table:
      return 'Table';
    case ReferenceKind.code:
      return 'Program';
    default:
      return '';
  }
}

export const toMarkdown: MdFormatSerialize = (state, node) => {
  const { kind, key } = node.attrs as Attrs;
  const id = state.options.localizeId?.(key ?? '') ?? key;
  switch (kind) {
    case ReferenceKind.cite: {
      const citeKey = state.options.localizeCitation?.(key ?? '') ?? key ?? '';
      if (state.nextCitationInGroup) {
        state.write(state.nextCitationInGroup > 1 ? `${citeKey}, ` : citeKey);
        state.nextCitationInGroup -= 1;
      } else {
        state.write(`{cite:t}\`${citeKey}\``);
      }
      return;
    }
    case ReferenceKind.eq:
      state.write(`{eq}\`${id}\``);
      return;
    case ReferenceKind.sec:
    case ReferenceKind.fig:
    case ReferenceKind.table:
    case ReferenceKind.code:
    default:
      state.write(`{numref}\`${getPrependedText(kind)} %s <${id}>\``);
  }
};

export const toTex: TexFormatSerialize = (state, node) => {
  const { kind, key } = node.attrs as Attrs;
  let prepend = getPrependedText(kind);
  if (kind === ReferenceKind.cite) {
    const citeKey = state.options.localizeCitation?.(key ?? '') ?? key ?? '';
    if (state.nextCitationInGroup) {
      state.write(state.nextCitationInGroup > 1 ? `${citeKey}, ` : citeKey);
      state.nextCitationInGroup -= 1;
    } else {
      state.write(`\\cite{${citeKey}}`);
    }
    return;
  }
  prepend = prepend ? `${prepend}~` : prepend;
  const id = state.options.localizeId?.(key ?? '') ?? key;
  if (id) state.write(`${prepend}\\ref{${id}}`);
};

export default cite;
