import { FlowContent } from 'myst-spec';
import { createLatexStatement } from '../serialize/tex/utils';
import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import { NodeGroups, MyNodeSpec } from './types';

export type MarginMystNode = {
  type: 'margin';
  children: FlowContent[];
};

const aside: MyNodeSpec<Record<string, never>, MarginMystNode> = {
  attrs: {},
  group: NodeGroups.top,
  content: NodeGroups.blockOrHeading,
  toDOM() {
    return ['aside', { class: 'margin' }, 0];
  },
  parseDOM: [
    { tag: 'aside' }, // This is legacy and should be removed!
    { tag: 'aside.margin' },
  ],
  attrsFromMdastToken() {
    return {};
  },
  toMyst(props) {
    return {
      type: 'margin',
      children: (props.children || []) as FlowContent[],
    };
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.ensureNewLine();
  // This is a bit of a hack, callouts often have other directives
  state.write('````{margin}');
  state.ensureNewLine();
  state.renderContent(node);
  state.write('````');
  state.closeBlock(node);
};

export const toTex: TexFormatSerialize = createLatexStatement(
  () => ({
    command: 'aside',
  }),
  (state, node) => {
    state.renderContent(node);
  },
);

export default aside;
