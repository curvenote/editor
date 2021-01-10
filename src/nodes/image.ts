import { NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatSerialize } from './types';
import { DEFAULT_IMAGE_WIDTH, clamp } from '../utils';

const getImageWidth = (width?: string) => {
  const widthNum = Number.parseInt((width ?? String(DEFAULT_IMAGE_WIDTH)).replace('%', ''), 10);
  return clamp(widthNum || DEFAULT_IMAGE_WIDTH, 10, 100);
};

const image: NodeSpec = {
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null },
    align: { default: 'center' },
    width: { default: DEFAULT_IMAGE_WIDTH },
  },
  group: NodeGroups.block,
  draggable: true,
  parseDOM: [{
    tag: 'img[src]',
    getAttrs(dom: any) {
      return {
        src: dom.getAttribute('src'),
        title: dom.getAttribute('title'),
        alt: dom.getAttribute('alt'),
        align: dom.getAttribute('align') ?? 'center',
        width: getImageWidth(dom.getAttribute('width')),
      };
    },
  }],
  toDOM(node) {
    const {
      src, alt, title, align, width,
    } = node.attrs; return ['img', {
      src, alt, title, align, width: `${width}%`,
    }];
  },
};


export const toMarkdown: FormatSerialize = (state, node) => {
  state.write(`![${state.esc(node.attrs.alt || '')}](${state.esc(node.attrs.src)
  }${node.attrs.title ? ` ${state.quote(node.attrs.title)}` : ''})`);
};

export const toTex: FormatSerialize = (state, node) => {
  const width = Math.round(node.attrs.width ?? DEFAULT_IMAGE_WIDTH);
  let align = 'center';
  switch (node.attrs.align?.toLowerCase()) {
    case 'left':
      align = 'flushleft';
      break;
    case 'right':
      align = 'flushright';
      break;
    default:
      break;
  }
  const template = `\n\\begin{${align}}
  \\includegraphics[width=${width / 100}\\linewidth]{${node.attrs.src}}
\\end{${align}}\n`;
  state.write(template);
};

export default image;
