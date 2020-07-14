import { NodeSpec } from 'prosemirror-model';
import { NodeGroups } from './types';

const aside: NodeSpec = {
  group: NodeGroups.top,
  content: `${NodeGroups.block}+`,
  toDOM() { return ['aside', 0]; },
  parseDOM: [
    { tag: 'aside' },
  ],
};

export default aside;
