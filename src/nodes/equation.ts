import { NodeGroups, MyNodeSpec, NumberedNode } from './types';
import { MdFormatSerialize } from '../serialize/types';
import { createLatexStatement } from '../serialize/tex/utils';
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

export const equationNoDisplay: MyNodeSpec<Attrs> = {
  ...equation,
  content: `${NodeGroups.text}*`,
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  const { numbered, id } = node.attrs;
  state.ensureNewLine();
  const amsBegin = node.textContent.startsWith('\\begin{');
  const amsEnd = node.textContent.match(/\\end{([a-z*]+)}$/);
  const ams = amsBegin && amsEnd;
  if (!ams) state.write('$$');
  // TODO: export the label if it is AMS math mode
  if (!ams && numbered && id) {
    state.write(`\\label{${id}}`);
    state.ensureNewLine();
  }
  state.text(node.textContent, false);
  if (!ams) state.write('$$');
  state.closeBlock(node);
};

export const toTex = createLatexStatement(
  () => ({ command: 'equation' }),
  (state, node) => {
    // TODO: export the label if it isn't inline!
    const { numbered, id } = node.attrs;
    if (numbered && id) {
      state.write(`\\label{${id}}`);
    }
    state.ensureNewLine();
    state.text(node.textContent, false);
  },
);

export default equation;
