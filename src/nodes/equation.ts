import { NodeSpec } from 'prosemirror-model';
import { NodeGroups } from './types';

const equation: NodeSpec = {
  group: NodeGroups.inline,
  // Content can have display elements inside of it for dynamic equaitons
  content: `(${NodeGroups.text} | display)*`,
  inline: true,
  draggable: false,
  // The view treat the node as a leaf, even though it technically has content
  atom: true,
  toDOM: () => ['r-equation', 0],
  parseDOM: [{ tag: 'r-equation' }],
};

export default equation;
