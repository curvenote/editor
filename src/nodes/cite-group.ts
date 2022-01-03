import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import { NodeGroups, MyNodeSpec } from './types';

export type Attrs = Record<string, never>;

const citeGroup: MyNodeSpec<Attrs> = {
  attrs: {},
  inline: true,
  atom: true,
  group: NodeGroups.inline,
  marks: '',
  content: `${NodeGroups.cite}+`,
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
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.nextCitationInGroup = node.childCount;
  state.write('{citep}`');
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

export default citeGroup;
