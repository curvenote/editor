import { NodeGroups, FormatSerialize, MyNodeSpec, NumberedNode } from './types';
import { getNumberedAttrs, numberedAttrs, setNumberedAttrs } from './utils';

const getAttrs = (level: number) => (dom: HTMLElement) => ({
  ...getNumberedAttrs(dom),
  level,
});

export type Attrs = NumberedNode & {
  level: number;
};

const heading: MyNodeSpec<Attrs> = {
  attrs: {
    ...numberedAttrs(false),
    level: { default: 1 },
  },
  content: `${NodeGroups.inline}*`,
  group: NodeGroups.block,
  defining: true,
  parseDOM: [
    { tag: 'h1', getAttrs: getAttrs(1) },
    { tag: 'h2', getAttrs: getAttrs(2) },
    { tag: 'h3', getAttrs: getAttrs(3) },
    { tag: 'h4', getAttrs: getAttrs(4) },
    { tag: 'h5', getAttrs: getAttrs(5) },
    { tag: 'h6', getAttrs: getAttrs(6) },
  ],
  toDOM(node) {
    return [`h${node.attrs.level}`, setNumberedAttrs(node.attrs), 0];
  },
};

export const toMarkdown: FormatSerialize = (state, node) => {
  // TODO: Put the id in:
  state.write(`${state.repeat('#', node.attrs.level)} `);
  state.renderInline(node);
  state.closeBlock(node);
};

export const toTex: FormatSerialize = (state, node) => {
  const { level } = node.attrs;
  if (level === 1) state.write('\\section*{');
  if (level === 2) state.write('\\subsection*{');
  if (level === 3) state.write('\\subsubsection*{');
  if (level === 4) state.write('\\paragraph*{');
  if (level === 5) state.write('\\subparagraph*{');
  if (level === 6) state.write('\\subparagraph*{');
  state.renderInline(node);
  state.write('}');
  // TODO \label{sec:x}
  state.closeBlock(node);
};

export default heading;
