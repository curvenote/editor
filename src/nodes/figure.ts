import { Node } from 'prosemirror-model';
import { MdFormatSerialize } from '../serialize/types';
import { createLatexStatement } from '../serialize/tex/utils';
import { AlignOptions, CaptionKind, MyNodeSpec, NodeGroups } from './types';
import { determineCaptionKind } from '../process/modifyTransactions';

export type Attrs = {
  align: AlignOptions;
};

const figure: MyNodeSpec<Attrs> = {
  group: NodeGroups.block,
  content: NodeGroups.insideFigure,
  attrs: {
    align: { default: 'center' },
  },
  toDOM(node) {
    const { align } = node.attrs;
    return ['figure', { align }, 0];
  },
  parseDOM: [
    {
      tag: 'figure',
      getAttrs(dom) {
        return {
          align: dom.getAttribute('align') ?? 'center',
        };
      },
    },
  ],
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.ensureNewLine();
  const { kind } = node.attrs;
  // TODO: Translate between callout/admonition
  state.write(`\`\`\`{${kind || 'note'}}`);
  state.ensureNewLine();
  state.renderContent(node);
  state.write('```');
  state.closeBlock(node);
};

function nodeToCommand(node: Node) {
  const kind = determineCaptionKind(node);
  switch (kind) {
    case CaptionKind.fig:
      return 'figure';
    case CaptionKind.table:
      return 'table';
    case CaptionKind.code:
      return 'code';
    case CaptionKind.eq:
      return 'figure'; // not sure what to do here.
    default:
      return 'figure';
  }
}

export const toTex = createLatexStatement(
  (opts, node) => {
    return {
      command: nodeToCommand(node),
      bracketOpts: '!htbp',
    };
  },
  (state, node) => {
    state.write('\\centering');
    state.ensureNewLine();
    state.renderContent(node);
  },
);

export default figure;
