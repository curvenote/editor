import { NodeSpec } from 'prosemirror-model';
import { readBooleanDomAttr } from '../utils';
import { NodeGroups, FormatSerialize } from './types';

const getAttrs = (level: number) => (dom: any) => ({
  level,
  numbered: readBooleanDomAttr(dom, 'numbered'),
  label: dom.getAttribute('label') ?? '',
});

export const heading: NodeSpec = {
  attrs: {
    level: { default: 1 },
    numbered: { default: false },
    label: { default: '' },
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
    const {
      level, numbered, label,
    } = node.attrs;
    return [`h${level}`, { numbered: numbered ? '' : undefined, label: label || undefined }, 0];
  },
};

export const toMarkdown: FormatSerialize = (state, node) => {
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
