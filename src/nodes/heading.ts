import { Heading, PhrasingContent } from 'myst-spec';
import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import { NodeGroups, MyNodeSpec, NumberedNode } from './types';
import { getNumberedAttrs, getNumberedDefaultAttrs, setNumberedAttrs } from './utils';

const getAttrs = (level: number) => (dom: HTMLElement) => ({
  ...getNumberedAttrs(dom),
  level,
});

export type HeadingMystNode = Heading & {
  numbered?: boolean;
  number?: string;
};

export type Attrs = NumberedNode & {
  level: number;
};

const heading: MyNodeSpec<Attrs, HeadingMystNode> = {
  attrs: {
    ...getNumberedDefaultAttrs(),
    level: { default: 1 },
  },
  content: `${NodeGroups.inline}*`,
  group: NodeGroups.heading,
  defining: true,
  parseDOM: [
    { tag: 'h1', getAttrs: getAttrs(1) },
    { tag: 'h2', getAttrs: getAttrs(2) },
    { tag: 'h3', getAttrs: getAttrs(3) },
    { tag: 'h4', getAttrs: getAttrs(4) },
    { tag: 'h5', getAttrs: getAttrs(5) },
    { tag: 'h6', getAttrs: getAttrs(6) },
  ],
  toDOM(node) {
    return [`h${node.attrs.level}`, setNumberedAttrs(node.attrs), 0];
  },
  attrsFromMdastToken: (token) => ({
    id: null,
    label: null,
    numbered: token.numbered ?? false,
    level: token.depth,
  }),
  toMyst: (props): Heading => ({
    type: 'heading',
    depth: parseInt(props.tag.slice(1), 10),
    children: (props.children || []) as PhrasingContent[],
  }),
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  // TODO: Put the id in:
  state.write(`${state.repeat('#', node.attrs.level)} `);
  state.renderInline(node);
  state.closeBlock(node);
};

export const toTex: TexFormatSerialize = (state, node) => {
  const { level, id, numbered } = node.attrs as Attrs;
  if (level === 1) state.write(`\\section${numbered ? '' : '*'}{`);
  if (level === 2) state.write(`\\subsection${numbered ? '' : '*'}{`);
  if (level === 3) state.write(`\\subsubsection${numbered ? '' : '*'}{`);
  if (level === 4) state.write(`\\paragraph${numbered ? '' : '*'}{`);
  if (level === 5) state.write(`\\subparagraph${numbered ? '' : '*'}{`);
  if (level === 6) state.write(`\\subparagraph${numbered ? '' : '*'}{`);
  state.renderInline(node);
  state.write('}');
  if (numbered && id) {
    state.write(`\\label{${id}}`);
  }
  state.closeBlock(node);
};

export default heading;
