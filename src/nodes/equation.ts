import { NodeGroups, FormatSerialize, MyNodeSpec, NumberedNode } from './types';
import { latexStatement } from '../serialize/tex/utils';
import { getAttr, getNumberedAttrs, getNumberedDefaultAttrs, setNumberedAttrs } from './utils';

export type Attrs = NumberedNode & {
  title: string;
};

const equation: MyNodeSpec<Attrs> = {
  group: NodeGroups.top,
  // Content can have display elements inside of it for dynamic equations
  content: `(${NodeGroups.text} | display)*`,
  draggable: false,
  // The view treat the node as a leaf, even though it technically has content
  atom: true,
  code: true,
  attrs: {
    ...getNumberedDefaultAttrs(),
    title: { default: '' },
  },
  toDOM: (node) => {
    const { title } = node.attrs;
    return ['r-equation', { ...setNumberedAttrs(node.attrs), title: title || undefined }, 0];
  },
  parseDOM: [
    {
      tag: 'r-equation:not([inline])',
      getAttrs(dom) {
        return {
          ...getNumberedAttrs(dom),
          title: getAttr(dom, 'title'),
        };
      },
    },
  ],
};

export const toMarkdown: FormatSerialize = (state, node) => {
  state.ensureNewLine();
  const amsBegin = node.textContent.startsWith('\\begin{');
  const amsEnd = node.textContent.match(/\\end{([a-z*]+)}$/);
  const ams = amsBegin && amsEnd;
  if (!ams) state.write('$$');
  // TODO: export the label if it isn't inline!
  state.text(node.textContent, false);
  if (!ams) state.write('$$');
  state.closeBlock(node);
};

export const toTex = latexStatement('equation', (state, node) => {
  // TODO: export the label if it isn't inline!
  state.text(node.textContent, false);
});

export default equation;
