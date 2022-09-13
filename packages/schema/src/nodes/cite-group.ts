import type { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import type { MyNodeSpec, NodeGroup } from './types';
import type { Cite, CiteGroup } from '../spec';

export type Attrs = Record<string, never>;

export function createCiteGroup(nodeGroup: NodeGroup): MyNodeSpec<Attrs, CiteGroup> {
  return {
    attrs: {},
    inline: true,
    atom: true,
    group: nodeGroup.inline,
    marks: '',
    content: `${nodeGroup.cite}+`,
    draggable: true,
    parseDOM: [
      {
        tag: 'cite-group',
        getAttrs() {
          return {};
        },
      },
    ],
    toDOM() {
      return ['cite-group', 0];
    },
    attrsFromMyst: () => ({}),
    toMyst: (props) => ({
      type: 'citeGroup',
      kind: 'parenthetical',
      children: props.children as Cite[],
    }),
  };
}

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.nextCitationInGroup = node.childCount;
  state.write('{cite:p}`');
  state.renderInline(node);
  state.write('`');
  state.nextCitationInGroup = 0;
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.nextCitationInGroup = node.childCount;
  state.write('\\citep{');
  state.renderInline(node);
  state.write('}');
  state.nextCitationInGroup = 0;
};
