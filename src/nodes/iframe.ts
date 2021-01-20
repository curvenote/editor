import { NodeSpec } from 'prosemirror-model';
import { NodeGroups, FormatSerialize } from './types';
import { DEFAULT_IMAGE_WIDTH, getImageWidth } from '../utils';

const image: NodeSpec = {
  attrs: {
    src: {},
    align: { default: 'center' },
    width: { default: DEFAULT_IMAGE_WIDTH },
  },
  group: NodeGroups.block,
  draggable: true,
  parseDOM: [{
    tag: 'iframe[src]',
    getAttrs(dom: any) {
      return {
        src: dom.getAttribute('src'),
        align: dom.getAttribute('align') ?? 'center',
        width: getImageWidth(dom.getAttribute('width')),
      };
    },
  }],
  toDOM(node) {
    const {
      src, align, width,
    } = node.attrs; return ['iframe', {
      src, align, width: `${width}%`,
    }];
  },
};

export const toMarkdown: FormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write('```{iframe}');
  state.ensureNewLine();
  state.write('```');
  state.closeBlock(node);
};

export const toTex: FormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.closeBlock(node);
};


export default image;
