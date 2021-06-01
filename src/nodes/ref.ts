import { NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatSerialize } from './types';

const ref: NodeSpec = {
  attrs: {
    kind: { default: null },
    key: { default: null },
  },
  inline: true,
  marks: '',
  group: NodeGroups.inline,
  draggable: true,
  parseDOM: [{
    tag: 'cite.ref',
    getAttrs(dom: any) {
      return {
        kind: dom.getAttribute('kind'),
        key: dom.getAttribute('key') ?? dom.getAttribute('data-key') ?? dom.getAttribute('data-cite') ?? dom.getAttribute('data-ref'),
      };
    },
    // cite is also parsed, and this is higher priority
    priority: 60,
  }],
  toDOM(node) {
    const { key, kind } = node.attrs;
    return ['cite', { class: 'ref', kind, key }];
  },
};


export const toMarkdown: FormatSerialize = (state, node) => {
  state.write(`{ref}\`${node.attrs.key}\``);
};

export const toTex: FormatSerialize = (state, node) => {
  state.write(`\\ref{${node.attrs.key}}`);
};

export default ref;
