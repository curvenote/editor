import { NodeGroups, FormatSerialize, MyNodeSpec } from './types';

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

export const toMarkdown: FormatSerialize = (state, node) => {
  state.write('$');
  state.renderInline(node);
  state.write('$');
};

export const toTex = toMarkdown;

export default math;
