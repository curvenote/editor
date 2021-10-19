import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import { MyNodeSpec, NodeGroups } from './types';

const footnote: MyNodeSpec<any> = {
  attrs: {},
  group: 'inline',
  content: `(${NodeGroups.text} | math)*`,
  inline: true,
  draggable: true,
  // This makes the view treat the node as a leaf, even though it
  // technically has content
  atom: true,
  toDOM: () => ['span', { class: 'footnote' }, 0],
  parseDOM: [{ tag: 'span.footnote' }],
};

// TODO: add markdown support
export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.write('(');
  state.renderInline(node);
  state.write(')');
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.write('\\footnote{');
  state.renderInline(node);
  state.write('}');
};

export default footnote;
