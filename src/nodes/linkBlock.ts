import { MyNodeSpec, NodeGroups } from './types';
import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import { StaticPhrasingContent, LinkBlock } from '../spec';

export interface Attrs {
  title: string;
  description: string;
  blockUrl: string;
}

const link_block: MyNodeSpec<Attrs, LinkBlock> = {
  attrs: {
    blockUrl: { default: '' },
    title: { default: '' },
    description: { default: '' },
  },
  group: NodeGroups.top,
  content: `${NodeGroups.text}*`,
  parseDOM: [
    {
      tag: 'div[description][block-url]',
      getAttrs(dom: any) {
        const attrs = {
          blockUrl: dom.getAttribute('block-url') || null,
          description: dom.getAttribute('description') || '',
          title: dom.textContent || '',
        };
        console.log('parsing', dom, attrs);
        return attrs;
      },
    },
  ],
  toDOM(node: any) {
    const { title, description, blockUrl } = node.attrs;
    return [
      'a',
      {
        'block-url': blockUrl || undefined,
        description,
      },
      title,
    ];
  },
  attrsFromMyst: (token) => {
    let description = '';
    if (token.children.length && token.children[0].type === 'text') {
      description = token.children[0].value;
    }
    return {
      blockUrl: token.url,
      title: token.title || '',
      description,
    };
  },
  toMyst: (props) => {
    return {
      type: 'linkBlock',
      url: props['block-url'],
      title: props.title || undefined,
      children: (props.children || []) as StaticPhrasingContent[],
    };
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  // TODO Replace with link block directive...?
  state.ensureNewLine();
  state.write(`\n[${node.attrs.description}](${node.attrs.url} ${node.attrs.title})\n\n`);
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.write('TODO: translate linkblock tex');
};

export default link_block;
