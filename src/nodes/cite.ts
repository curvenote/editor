import { NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatSerialize } from './types';

const cite: NodeSpec = {
  attrs: {
    key: { default: null },
    inline: { default: '' },
  },
  inline: true,
  marks: '',
  group: NodeGroups.inline,
  draggable: true,
  parseDOM: [{
    tag: 'cite',
    getAttrs(dom: any) {
      return {
        key: dom.getAttribute('key') ?? dom.getAttribute('data-key') ?? dom.getAttribute('data-cite'),
        inline: dom.getAttribute('inline') ?? '',
      };
    },
  }],
  toDOM(node) {
    const { key, inline } = node.attrs;
    return ['cite', { key, inline }];
  },
};


export const toMarkdown: FormatSerialize = (state, node) => {
  state.write(`{cite}\`${node.attrs.key}\``);
};

export const toTex: FormatSerialize = (state, node) => {
  state.write(`\\cite{${node.attrs.key}}`);
};

export default cite;
