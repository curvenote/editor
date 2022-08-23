import { DEFAULT_IMAGE_WIDTH } from '../defaults';
import { writeDirectiveOptions } from '../serialize/markdown/utils';
import type { MdFormatSerialize } from '../serialize/types';
import type { Iframe } from '../spec';
import type { MyNodeSpec, AlignOptions } from './types';
import { NodeGroups } from './types';
import { getImageWidth } from './utils';

export type Attrs = {
  src: string;
  align: AlignOptions;
  width: number | null;
};

const iframe: MyNodeSpec<Attrs, Iframe> = {
  attrs: {
    src: {},
    align: { default: 'center' },
    width: { default: DEFAULT_IMAGE_WIDTH },
  },
  group: NodeGroups.content,
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
  attrsFromMyst: (node) => ({
    src: node.src,
    align: 'center',
    width: getImageWidth(node.width),
  }),
  toMyst: (node) => ({
    type: 'iframe',
    src: node.src,
    width: node.width,
  }),
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  const renderer = state.options.renderers?.iframe ?? 'html';
  // TODO: I think that the caption is not rendered here?!
  const { src, align, width } = node.attrs as Attrs;
  if (renderer === 'myst') {
    state.ensureNewLine();
    state.write(`\`\`\`{iframe} ${src}\n`);
    const opts = {
      label: state.nextCaptionId,
      // TODO: Align should come from figure
      align,
      width: `${width}%`,
    };
    writeDirectiveOptions(state, opts);
    // TODO: If there is a caption, put it here
    state.write('```');
    state.closeBlock(node);
    return;
  }
  state.ensureNewLine();
  state.write('```{raw} html\n');
  state.write(`<figure id="${state.nextCaptionId}" align="${align}">\n`);
  state.write(
    `  <div style="position: relative; display: inline-block; padding-bottom: 39%; width: ${width}%;">\n`,
  );
  state.write(
    `    <iframe width="100%" height="100%" src="${src}" allowfullscreen="" allow="autoplay" style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; border: none;"></iframe>\n`,
  );
  state.write(`  </div>\n`);
  state.write(`</figure>\n`);
  state.ensureNewLine();
  state.write('```');
  state.closeBlock(node);
};

export default iframe;
