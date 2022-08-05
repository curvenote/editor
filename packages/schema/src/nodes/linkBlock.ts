import type { MyNodeSpec } from './types';
import { NodeGroups } from './types';
import type { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import type { StaticPhrasingContent, LinkBlock } from '../spec';

export interface Attrs {
  title: string;
  description: string;
  url: string;
}

const LINK_BLOCK_CLASS = 'link-block';

const link_block: MyNodeSpec<Attrs, LinkBlock> = {
  attrs: {
    url: { default: '' },
    title: { default: '' },
    description: { default: '' },
  },
  group: NodeGroups.top,
  content: `${NodeGroups.text}*`,
  selectable: true,
  draggable: true,
  atom: true,
  isolating: true,
  parseDOM: [
    {
      tag: `div.${LINK_BLOCK_CLASS}`,
      getAttrs(dom: any) {
        const attrs = {
          url: dom.getAttribute('data-url') || null,
          title: dom.getAttribute('title') || '',
          description: dom.textContent || '',
        };
        return attrs;
      },
    },
  ],
  toDOM(node: any) {
    const { title, description, url } = node.attrs;
    return [
      'div',
      {
        'data-url': url || undefined,
        title,
        class: LINK_BLOCK_CLASS,
      },
      description,
    ];
  },
  attrsFromMyst: (token) => {
    let description = '';
    if (token.children.length && token.children[0].type === 'text') {
      description = token.children[0].value;
    }
    return {
      url: token.url,
      title: token.title || '',
      description,
    };
  },
  toMyst: (props) => {
    return {
      type: 'linkBlock',
      url: props['data-url'],
      title: props.title || undefined,
      children: (props.children || []) as StaticPhrasingContent[],
    };
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write(`\`\`\`{link-block} ${node.attrs.url}\n`);
  if (node.attrs.title) state.write(`:title: ${node.attrs.title}\n`);
  if (node.attrs.thumbnail) state.write(`:thumbnail: ${node.attrs.thumbnail}\n`);
  if (node.attrs.description) state.write(`${node.attrs.description}\n`);
  state.ensureNewLine();
  state.write('```');
  state.closeBlock(node);
};

export const toTex: TexFormatSerialize = (state, node) => {
  if (node.attrs.title) {
    state.write(`\\href{${node.attrs.url}}{${node.attrs.title}}`);
  } else {
    state.write(`\\url{${node.attrs.url}}`);
  }
};

export default link_block;
