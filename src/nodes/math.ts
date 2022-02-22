import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import { NodeGroups, MyNodeSpec } from './types';

export type Attrs = Record<string, never>;

const math: MyNodeSpec<Attrs> = {
  group: NodeGroups.inline,
  // Content can have display elements inside of it for dynamic equations
  content: `(${NodeGroups.text} | display)*`,
  inline: true,
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
};

export const mathNoDisplay: MyNodeSpec<Attrs> = {
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
