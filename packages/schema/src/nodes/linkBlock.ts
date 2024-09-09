import type { MyNodeSpec } from './types';
import { NodeGroups } from './types';
import type { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import type { StaticPhrasingContent, Card } from '../nodespec';

export interface Attrs {
  title: string;
  description: string;
  link: string;
}

const LINK_BLOCK_CLASS = 'link-block';

const link_block: MyNodeSpec<Attrs, Card> = {
  attrs: {
    link: { default: '' },
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
          link: dom.getAttribute('data-url') || null,
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
      link: token.link || '',
      title: token.title || '',
      header: token.header || '',
      footer: token.footer || '',
      description,
    };
  },
  toMyst: (props) => {
    return {
      type: 'card',
      title: props.title || props['data-url'],
      link: props['data-url'],
      children: (props.children || []) as StaticPhrasingContent[],
    };
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write(`\`\`\`{card} ${node.attrs.title}\n`);
  state.write(`:link: ${node.attrs.url}\n`);
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
