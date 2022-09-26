import { createLatexStatement } from '../serialize/tex/utils';
import type { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import type { Margin, FlowContent } from '../spec';
import type { MyNodeSpec, NodeGroup } from './types';

export function createAsideNodeSpec(
  nodeGroup: NodeGroup,
): MyNodeSpec<Record<string, never>, Margin> {
  return {
    attrs: {},
    group: nodeGroup.top,
    content: nodeGroup.blockOrHeading,
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
}

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
