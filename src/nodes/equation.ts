import { NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatSerialize } from './types';
import { latexStatement } from '../serialize/tex/utils';

export type EquationAttrs = {
};

const equation: NodeSpec = {
  group: NodeGroups.top,
  // Content can have display elements inside of it for dynamic equations
  content: `(${NodeGroups.text} | display)*`,
  draggable: false,
  // The view treat the node as a leaf, even though it technically has content
  atom: true,
  code: true,
  attrs: {},
  toDOM: () => ['r-equation', 0],
  parseDOM: [{
    tag: 'r-equation:not([inline])',
  }],
};

export const toMarkdown: FormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write('$$');
  state.text(node.textContent, false);
  state.write('$$');
  state.closeBlock(node);
};

export const toTex = latexStatement('equation', (state, node) => {
  state.text(node.textContent, false);
});

export default equation;
