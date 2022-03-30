import { Image } from 'myst-spec';
import { DEFAULT_IMAGE_WIDTH } from '../defaults';
import { NodeGroups, NumberedNode, MyNodeSpec, AlignOptions } from './types';
import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import {
  getImageWidth,
  readBooleanDomAttr,
  getNumberedDefaultAttrs,
  getNumberedAttrs,
  setNumberedAttrs,
} from './utils';

export type Attrs = NumberedNode & {
  src: string;
  alt: string;
  title: string;
  align: AlignOptions;
  width: number | null;
  caption: boolean;
};

const image: MyNodeSpec<Attrs, Image> = {
  attrs: {
    ...getNumberedDefaultAttrs(), // Deprecated, use figure
    src: {},
    alt: { default: null },
    title: { default: null },
    width: { default: DEFAULT_IMAGE_WIDTH },
    align: { default: 'center' }, // Deprecated, use figure
    caption: { default: false }, // Deprecated, use figcaption
  },
  group: NodeGroups.block,
  draggable: true,
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs(dom) {
        return {
          ...getNumberedAttrs(dom), // Deprecated, use figure
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
          align: dom.getAttribute('align') ?? 'center', // Deprecated, use figure
          width: getImageWidth(dom.getAttribute('width')),
          caption: readBooleanDomAttr(dom, 'caption'),
        };
      },
    },
  ],
  toDOM(node) {
    const { src, alt, title, width, align } = node.attrs;
    return [
      'img',
      {
        ...setNumberedAttrs(node.attrs), // Deprecated, use figure
        src,
        align,
        alt: alt || undefined,
        title: title || undefined,
        width: `${width}%`,
      },
    ];
  },
  attrsFromMdastToken: (token) => ({
    id: token.identifier || null,
    label: token.label || null,
    numbered: token.numbered,
    src: token.url || '',
    alt: token.alt || '',
    title: token.title || '',
    width: getImageWidth(token.width),
    align: token.align || 'center',
    caption: false,
  }),
  toMyst: (props): Image => ({
    type: 'image',
    url: props.src,
    alt: props.alt || undefined,
    title: props.title || undefined,
    align: undefined,
    width: props.width || undefined,
  }),
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  const src = state.options.localizeImageSrc?.(node.attrs.src) || node.attrs.src;
  const md = `![${state.esc(node.attrs.alt || '')}](${state.esc(src)}${
    node.attrs.title ? ` ${state.quote(node.attrs.title)}` : ''
  })`;
  state.write(md);
  state.closeBlock(node);
};

export const toTex: TexFormatSerialize = (state, node) => {
  const { width: nodeWidth } = node.attrs as Attrs;
  const src = state.options.localizeImageSrc?.(node.attrs.src) || node.attrs.src;
  const width = Math.round(nodeWidth ?? DEFAULT_IMAGE_WIDTH);
  //   let align = 'center';
  //   switch (nodeAlign?.toLowerCase()) {
  //     case 'left':
  //       align = 'flushleft';
  //       break;
  //     case 'right':
  //       align = 'flushright';
  //       break;
  //     default:
  //       break;
  //   }
  //   if (!caption) {
  //     const template = `
  // \\begin{${align}}
  //   \\includegraphics[width=${width / 100}\\linewidth]{${src}}
  // \\end{${align}}\n`;
  //     state.write(template);
  //     return;
  //   }
  state.write(`\\includegraphics[width=${width / 100}\\linewidth]{${src}}`);
  state.closeBlock(node);
};

export default image;
