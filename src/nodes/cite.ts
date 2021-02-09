import { NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatSerialize } from './types';

const cite: NodeSpec = {
  attrs: {
    key: { default: null },
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
      };
    },
  }],
  toDOM(node) {
    const { key } = node.attrs;
    return ['cite', { key }];
  },
};


export const toMarkdown: FormatSerialize = (state, node) => {
  state.write(`{cite}\`${node.attrs.key}\``);
};

export const toTex: FormatSerialize = (state, node) => {
  state.write(`\\cite{${node.attrs.key}}`);
};

export default cite;
