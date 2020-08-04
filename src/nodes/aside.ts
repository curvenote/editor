import { NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatMarkdown } from './types';

const aside: NodeSpec = {
  group: NodeGroups.top,
  content: `${NodeGroups.block}+`,
  toDOM() { return ['aside', 0]; },
  parseDOM: [
    { tag: 'aside' },
  ],
};

export const toMarkdown: FormatMarkdown = (state, node) => {
  state.ensureNewLine();
  state.write('```{margin}');
  state.ensureNewLine();
  state.renderContent(node);
  state.write('```');
  state.closeBlock(node);
};

export default aside;
