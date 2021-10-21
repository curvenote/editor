import { NodeSpec } from 'prosemirror-model';
import { createLatexStatement } from '../serialize/tex/utils';
import {
  MdFormatSerialize,
  TexFormatSerialize,
  TexFormatTypes,
  TexOptions,
} from '../serialize/types';
import { NodeGroups } from './types';

const aside: NodeSpec = {
  group: NodeGroups.top,
  content: NodeGroups.blockOrHeading,
  toDOM() {
    return ['aside', { class: 'margin' }, 0];
  },
  parseDOM: [
    { tag: 'aside' }, // This is legacy and should be removed!
    { tag: 'aside.margin' },
  ],
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write('```{margin}');
  state.ensureNewLine();
  state.renderContent(node);
  state.write('```');
  state.closeBlock(node);
};

export const toTex: TexFormatSerialize = createLatexStatement(
  (options: TexOptions) => ({
    command: options.format === TexFormatTypes.tex_curvenote ? 'aside' : 'marginpar',
    inline: options.format === TexFormatTypes.tex,
  }),
  (state, node) => {
    state.renderContent(node);
  },
);

export default aside;
