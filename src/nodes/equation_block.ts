import { NodeSpec } from 'prosemirror-model';
import { NodeGroups } from './types';

export type EquationAttrs = {
  inline: boolean;
};

const equation_block: NodeSpec = {
  group: NodeGroups.block,
  // Content can have display elements inside of it for dynamic equaitons
  content: `(${NodeGroups.text} | display)*`,
  draggable: false,
  // The view treat the node as a leaf, even though it technically has content
  atom: true,
  attrs: {},
  toDOM: () => ['r-equation', 0],
  parseDOM: [{
    tag: 'r-equation',
  }],
};

export default equation_block;
