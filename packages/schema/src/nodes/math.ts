import type { InlineMath } from '../spec';
import type { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import type { MyNodeSpec } from './types';
import { NodeGroups } from './types';

export type Attrs = Record<string, never>;

const math: MyNodeSpec<Attrs, InlineMath> = {
  group: NodeGroups.inline,
  // Content can have display elements inside of it for dynamic equations
  content: `(${NodeGroups.text} | display)*`,
  inline: true,
  marks: '',
  draggable: false,
  // The view treat the node as a leaf, even though it technically has content
  atom: true,
  attrs: {},
  toDOM: () => ['r-equation', { inline: '' }, 0],
  parseDOM: [
    {
      tag: 'r-equation[inline]',
    },
  ],
  attrsFromMyst: () => ({}),
  toMyst: (props) => {
    if (props.children?.length === 1 && props.children[0].type === 'text') {
      return { type: 'inlineMath', value: props.children[0].value || '' };
    }
    throw new Error(`Math node does not have one child`);
  },
};

export const mathNoDisplay: MyNodeSpec<Attrs, InlineMath> = {
  ...math,
  content: `${NodeGroups.text}*`,
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.write('$');
  state.text(node.textContent, false);
  state.write('$');
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.write('$');
  // The latex escaping happens in the serializer
  state.renderInline(node);
  state.write('$');
};

export default math;
