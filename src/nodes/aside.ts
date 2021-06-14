import { NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatSerialize } from './types';

const aside: NodeSpec = {
  group: NodeGroups.top,
  content: `${NodeGroups.block}+`,
  toDOM() {
    return ['aside', { class: 'margin' }, 0];
  },
  parseDOM: [
    { tag: 'aside' }, // This is legacy and should be removed!
    { tag: 'aside.margin' },
  ],
};

export const toMarkdown: FormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write('```{margin}');
  state.ensureNewLine();
  state.renderContent(node);
  state.write('```');
  state.closeBlock(node);
};

export default aside;
