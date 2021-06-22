import { NodeSpec } from 'prosemirror-model';
import { FormatTypes, LatexOptions } from '../serialize/tex/types';
import { createLatexStatement } from '../serialize/tex/utils';
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

export const toTex: FormatSerialize = createLatexStatement(
  (options: LatexOptions) => (options.format === FormatTypes.tex_curvenote ? 'aside' : 'marginpar'),
  (state, node) => {
    state.renderContent(node);
  },
  (options: LatexOptions) => ({ inline: options.format === FormatTypes.tex }),
);

export default aside;
