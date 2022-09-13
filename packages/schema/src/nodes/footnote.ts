import type { FlowContent, InlineFootnote, NoAttrs } from '../spec';
import type { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import type { MyNodeSpec, Props } from './types';
import { LEGACY_NODE_GROUPS } from './types';
import { nodeNames } from '../types';

const footnote: MyNodeSpec<NoAttrs, InlineFootnote> = {
  attrs: {},
  group: LEGACY_NODE_GROUPS.inline,
  content: `(${LEGACY_NODE_GROUPS.text} | ${nodeNames.math})*`,
  inline: true,
  draggable: true,
  // This makes the view treat the node as a leaf, even though it
  // technically has content
  atom: true,
  toDOM: () => ['span', { class: 'footnote' }, 0],
  parseDOM: [{ tag: 'span.footnote' }],
  attrsFromMyst: () => ({}),
  toMyst: (props: Props) => ({
    type: 'inlineFootnote',
    children: [{ type: 'paragraph', children: props.children || [] }] as FlowContent[],
  }),
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
