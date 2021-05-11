import { NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatSerialize } from './types';
import { DEFAULT_IMAGE_WIDTH, getImageWidth, readBooleanDomAttr } from '../utils';

const image: NodeSpec = {
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null },
    align: { default: 'center' },
    width: { default: DEFAULT_IMAGE_WIDTH },
    numbered: { default: true },
    caption: { default: false },
    label: { default: '' },
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
        numbered: readBooleanDomAttr(dom, 'numbered'),
        caption: readBooleanDomAttr(dom, 'caption'),
        label: dom.getAttribute('label') ?? '',
      };
    },
  }],
  toDOM(node) {
    const {
      src, alt, title, align, width, numbered, caption, label,
    } = node.attrs; return ['img', {
      src, alt, title, align, width: `${width}%`, numbered, caption, label,
    }];
  },
};


export const toMarkdown: FormatSerialize = (state, node) => {
  state.write(`![${state.esc(node.attrs.alt || '')}](${state.esc(node.attrs.src)
  }${node.attrs.title ? ` ${state.quote(node.attrs.title)}` : ''})`);
  state.closeBlock(node);
};

export const toTex: FormatSerialize = (state, node) => {
  const {
    src, caption, numbered, label,
    width: nodeWidth,
    align: nodeAlign,
  } = node.attrs;
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
    const template = `\n\\begin{${align}}
  \\includegraphics[width=${width / 100}\\linewidth]{${src}}
\\end{${align}}\n`;
    state.write(template);
    return;
  }
  const template = `\n\\begin{figure}[h]
  \\centering
  \\includegraphics[width=${width / 100}\\linewidth]{${src}}
  \\caption{${src}.caption}${numbered ? `\n  \\label{${label}}` : ''}
\\end{${align}}\n`;
  state.write(template);
};

export default image;
