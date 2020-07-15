import { NodeSpec } from 'prosemirror-model';
import { NodeGroups } from './types';

export type EquationAttrs = {
  inline: boolean;
};

const equation: NodeSpec = {
  group: NodeGroups.inline,
  // Content can have display elements inside of it for dynamic equaitons
  content: `(${NodeGroups.text} | display)*`,
  inline: true,
  draggable: false,
  // The view treat the node as a leaf, even though it technically has content
  atom: true,
  attrs: {
    inline: { default: true },
  },
  toDOM: (node) => {
    const { inline } = node.attrs;
    return ['r-equation', { inline: inline ? '' : undefined } as any, 0];
  },
  parseDOM: [{
    tag: 'r-equation',
    getAttrs(dom: any): EquationAttrs {
      return {
        inline: dom.hasAttribute('inline'),
      };
    },
  }],
};

export default equation;
