import { createLatexStatement } from '../serialize/tex/utils';
import type { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import type { Margin, FlowContent } from '../spec';
import type { MyNodeSpec } from './types';
import { NodeGroups } from './types';

const aside: MyNodeSpec<Record<string, never>, Margin> = {
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
  attrsFromMyst() {
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
