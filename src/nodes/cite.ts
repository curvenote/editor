import { NodeGroups, FormatSerialize, MyNodeSpec, RefKind } from './types';

export type Attrs = {
  key: string | null;
  title: string | null;
  kind: RefKind;
  inline: null; // This has been replaced with text!
  text: string | null;
};

const cite: MyNodeSpec<Attrs> = {
  attrs: {
    key: { default: null },
    title: { default: '' },
    kind: { default: null },
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
          kind: dom.getAttribute('kind') ?? 'cite',
          // inline is for legacy
          inline: null,
          text: dom.getAttribute('inline') ?? dom.textContent ?? '',
        };
      },
    },
  ],
  toDOM(node) {
    const { key, kind, text } = node.attrs;
    return ['cite', { key, kind }, text];
  },
};

export const toMarkdown: FormatSerialize = (state, node) => {
  const { kind } = node.attrs;
  switch (kind) {
    case RefKind.cite:
      state.write(`{cite}\`${node.attrs.key}\``);
      return;
    default:
      state.write(`{numref}\`${node.attrs.text} %s <${node.attrs.key}>\``);
  }
};

export const toTex: FormatSerialize = (state, node) => {
  const { kind } = node.attrs;
  switch (kind) {
    case RefKind.cite:
      state.write(`\\cite{${node.attrs.key}}`);
      return;
    default:
      state.write(`\\ref{${node.attrs.key}}`);
  }
};

export default cite;
