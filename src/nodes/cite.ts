import { NodeGroups, FormatSerialize, MyNodeSpec, ReferenceKind } from './types';

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
      { key: key || undefined, kind: kind ?? 'cite', title: title || '', label: label || '' },
      text || '',
    ];
  },
};

export const toMarkdown: FormatSerialize = (state, node) => {
  const { kind } = node.attrs;
  switch (kind) {
    case ReferenceKind.cite:
      state.write(`{cite}\`${node.attrs.key}\``);
      return;
    default:
      state.write(`{numref}\`${node.attrs.text} %s <${node.attrs.key}>\``);
  }
};

export const toTex: FormatSerialize = (state, node) => {
  const { kind } = node.attrs;
  switch (kind) {
    case ReferenceKind.cite:
      state.write(`\\cite{${node.attrs.key}}`);
      return;
    default:
      state.write(`\\ref{${node.attrs.key}}`);
  }
};

export default cite;
