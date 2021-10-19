import { DEFAULT_IMAGE_WIDTH } from '../defaults';
import { MdFormatSerialize } from '../serialize/types';
import { NodeGroups, MyNodeSpec, AlignOptions } from './types';
import { getImageWidth } from './utils';

export type Attrs = {
  src: string;
  align: AlignOptions;
  width: number | null;
};

const iframe: MyNodeSpec<Attrs> = {
  attrs: {
    src: {},
    align: { default: 'center' },
    width: { default: DEFAULT_IMAGE_WIDTH },
  },
  group: NodeGroups.block,
  draggable: true,
  parseDOM: [
    {
      tag: 'iframe[src]',
      getAttrs(dom: any) {
        return {
          src: dom.getAttribute('src'),
          align: dom.getAttribute('align') ?? 'center',
          width: getImageWidth(dom.getAttribute('width')),
        };
      },
    },
  ],
  toDOM(node) {
    const { src, align, width } = node.attrs;
    return [
      'iframe',
      {
        src,
        align,
        width: `${width}%`,
      },
    ];
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.ensureNewLine();
  state.write('```{iframe}');
  state.ensureNewLine();
  state.write('```');
  state.closeBlock(node);
};

export default iframe;
