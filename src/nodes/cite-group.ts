import { Node, NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatSerialize } from './types';

const citeGroup: NodeSpec = {
  attrs: {
  },
  inline: true,
  atom: true,
  group: NodeGroups.inline,
  marks: '',
  content: `${NodeGroups.cite}+`,
  draggable: true,
  parseDOM: [{
    tag: 'cite-group',
    getAttrs() {
      return {};
    },
  }],
  toDOM() {
    return ['cite-group', 0];
  },
};

const getKeys = (node: Node) => {
  const keys: string[] = [];
  node.content.forEach((n) => keys.push(n.attrs.key));
  return keys;
};

export const toMarkdown: FormatSerialize = (state, node) => {
  state.write(`{citep}\`${getKeys(node).join(', ')}\``);
};

export const toTex: FormatSerialize = (state, node) => {
  state.write(`\\citep{${getKeys(node).join(', ')}}`);
};

export default citeGroup;
