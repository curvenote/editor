import { MyNodeSpec, NodeGroups } from './types';
import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';

export interface Attrs {
  title: string;
  description: string;
  blockUrl: string;
}

console.log('oh yeah');
const spec: any = {
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
  // TODO: fun myst stuff
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.write('TODO: translate linkblock markdown');
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.write('TODO: translate linkblock tex');
};

export default spec;
