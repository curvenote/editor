import { DEFAULT_IMAGE_WIDTH } from '../defaults';
import { NodeGroups, FormatSerialize, NumberedNode, MyNodeSpec, AlignOptions } from './types';
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

const image: MyNodeSpec<Attrs> = {
  attrs: {
    ...getNumberedDefaultAttrs(),
    src: {},
    alt: { default: null },
    title: { default: null },
    align: { default: 'center' },
    width: { default: DEFAULT_IMAGE_WIDTH },
    caption: { default: false },
  },
  group: NodeGroups.block,
  draggable: true,
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs(dom) {
        return {
          ...getNumberedAttrs(dom),
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
          align: dom.getAttribute('align') ?? 'center',
          width: getImageWidth(dom.getAttribute('width')),
          caption: readBooleanDomAttr(dom, 'caption'),
        };
      },
    },
  ],
  toDOM(node) {
    const { src, alt, title, align, width, caption } = node.attrs;
    return [
      'img',
      {
        ...setNumberedAttrs(node.attrs),
        src,
        alt: alt || undefined,
        title: title || undefined,
        align,
        width: `${width}%`,
        caption: caption ? '' : undefined,
      },
    ];
  },
};

export const toMarkdown: FormatSerialize = (state, node) => {
  const md = `![${state.esc(node.attrs.alt || '')}](${state.esc(node.attrs.src)}${
    node.attrs.title ? ` ${state.quote(node.attrs.title)}` : ''
  })`;
  state.write(md);
  state.closeBlock(node);
};

export const toTex: FormatSerialize = (state, node) => {
  const { src, caption, numbered, width: nodeWidth, align: nodeAlign } = node.attrs as Attrs;
  const width = Math.round(nodeWidth ?? DEFAULT_IMAGE_WIDTH);
  let align = 'center';
  switch (nodeAlign?.toLowerCase()) {
    case 'left':
      align = 'flushleft';
      break;
    case 'right':
      align = 'flushright';
      break;
    default:
      break;
  }
  if (!caption) {
    const template = `
\\begin{${align}}
  \\includegraphics[width=${width / 100}\\linewidth]{${src}}
\\end{${align}}\n`;
    state.write(template);
    return;
  }
  const texLabel = `\n  \\label{${src}}`;
  const star = numbered ? '' : '*';
  const template = `
\\begin{figure}[h]
  \\centering
  \\includegraphics[width=${width / 100}\\linewidth]{${src}}
  \\caption${star}{${src}.caption}${texLabel}
\\end{figure}\n`;
  state.write(template);
};

export default image;
