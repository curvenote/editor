import { Node } from 'prosemirror-model';
import { Caption, Container, Image, Legend, Table } from '../spec';
import { MdFormatSerialize } from '../serialize/types';
import { createLatexStatement } from '../serialize/tex/utils';
import { AlignOptions, CaptionKind, MyNodeSpec, NodeGroups, NumberedNode } from './types';
import { determineCaptionKind } from '../process/utils';
import {
  getColumnWidths,
  getFirstChildWithName,
  getNumberedAttrs,
  getNumberedDefaultAttrs,
  readBooleanDomAttr,
  normalizeLabel,
  readBooleanAttr,
  setNumberedAttrs,
  hasFancyTable,
  writeMdastSnippet,
} from './utils';
import { nodeNames } from '../types';
import type { Attrs as ImageAttrs } from './image';
import type { Attrs as IFrameAttrs } from './iframe';
import { toMarkdown as codeToMarkdown } from './code';
import { writeDirectiveOptions } from '../serialize/markdown/utils';

export type Attrs = NumberedNode & {
  align: AlignOptions;
  multipage: boolean;
  landscape: boolean;
  fullpage: boolean;
};

const figure: MyNodeSpec<Attrs, Container> = {
  group: NodeGroups.block,
  content: NodeGroups.insideFigure,
  isolating: true,
  attrs: {
    ...getNumberedDefaultAttrs(),
    align: { default: 'center' },
    multipage: { default: false },
    landscape: { default: false },
    fullpage: { default: false },
  },
  toDOM(node) {
    const { align, multipage, landscape, fullpage } = node.attrs;
    return [
      'figure',
      {
        ...setNumberedAttrs(node.attrs),
        align,
        multipage,
        landscape,
        fullpage,
      },
      0,
    ];
  },
  parseDOM: [
    {
      tag: 'figure',
      getAttrs(dom) {
        return {
          ...getNumberedAttrs(dom),
          align: dom.getAttribute('align') ?? 'center',
          multipage: readBooleanDomAttr(dom, 'multipage'),
          landscape: readBooleanDomAttr(dom, 'landscape'),
          fullpage: readBooleanDomAttr(dom, 'fullpage'),
        };
      },
    },
  ],
  attrsFromMyst: (token) => {
    const match = token.class?.match(/align-(left|right|center)/);
    return {
      id: token.identifier || null,
      label: null, // This is deprecated
      numbered: token.enumerated || false,
      align: (match ? match[1] : 'center') as AlignOptions,
      multipage: false,
      landscape: false,
      fullpage: false,
    };
  },
  toMyst: (props, options) => {
    let containerKind: 'figure' | 'table' = 'figure';
    props.children?.forEach((child) => {
      if (child.type === 'image' || child.type === 'table') {
        child.align = props.align || undefined;
      }
      if (child.type === 'table') {
        containerKind = 'table';
      }
    });
    const localizedId = options.localizeId?.(props.id ?? '') ?? props.id ?? '';
    return {
      type: 'container',
      kind: containerKind,
      ...normalizeLabel(localizedId),
      enumerated: readBooleanAttr(props.numbered),
      class: props.align ? `align-${props.align}` : undefined,
      children: (props.children || []) as (Caption | Legend | Image | Table)[],
    };
  },
};

export const toMarkdown: MdFormatSerialize = (state, node, parent, index) => {
  state.ensureNewLine();
  const kind = determineCaptionKind(node);
  const { id } = node.attrs as Attrs;
  // TODO: Translate between callout/admonition
  const caption = getFirstChildWithName(node, nodeNames.figcaption);
  state.nextCaptionId = state.options.localizeId?.(id ?? '') ?? id ?? undefined;
  switch (kind) {
    case CaptionKind.fig: {
      const image = getFirstChildWithName(node, [nodeNames.image, nodeNames.iframe]);
      if (!image) return;
      const { src, align, width } = image?.attrs as ImageAttrs | IFrameAttrs;
      const href = state.options.localizeImageSrc?.(src) ?? src;
      if (image.type.name === nodeNames.iframe) {
        state.render(image);
        return;
      }
      state.write(`\`\`\`{figure} ${href}\n`);
      const opts = { name: state.nextCaptionId, align, width: `${width}%` };
      writeDirectiveOptions(state, opts);
      if (caption) {
        state.renderInline(caption);
        state.ensureNewLine();
      }
      state.write('```');
      state.closeBlock(node);
      return;
    }
    case CaptionKind.eq: {
      state.renderContent(node);
      return;
    }
    case CaptionKind.table: {
      const table = getFirstChildWithName(node, [nodeNames.table]);
      if (table && hasFancyTable(table)) {
        writeMdastSnippet(state, node);
        return;
      }
      state.nextTableCaption = caption;
      if (table) state.render(table);
      state.closeBlock(node);
      return;
    }
    case CaptionKind.code: {
      const code = getFirstChildWithName(node, [nodeNames.code_block]);
      // TODO: add a figure caption for code
      if (code) codeToMarkdown(state, code, node, index);
      state.closeBlock(node);
      return;
    }
    default:
      throw new Error(`Unknown figure kind: "${kind}"`);
  }
};

function nodeToCommand(node: Node) {
  const kind = determineCaptionKind(node);
  switch (kind) {
    case CaptionKind.fig:
      return node.attrs.fullpage ? 'figure*' : 'figure';
    case CaptionKind.table:
      return node.attrs.fullpage ? 'table*' : 'table';
    case CaptionKind.code:
      // TODO full width code
      return 'code';
    case CaptionKind.eq:
      return 'figure'; // not sure what to do here.
    default:
      return 'figure';
  }
}

function nodeToLaTeXOptions(node: Node) {
  const kind = determineCaptionKind(node);
  switch (kind) {
    case CaptionKind.fig:
    case CaptionKind.table:
      return '!htbp';
    case CaptionKind.code:
      return 'H';
    case CaptionKind.eq:
    default:
      return undefined;
  }
}

function figureContainsTable(node: Node<any>) {
  const table = (node.content as any).content.find((n: any) => n.type.name === nodeNames.table);
  return table;
}

export const toTex = createLatexStatement(
  (state, node) => {
    // if the figure is in a table, skip to child content
    if (state.isInTable) return null;

    // if figure contains a table, we need find out which table environment to use
    state.containsTable = false;
    const table = figureContainsTable(node);

    let tableInfo;
    if (table && node.attrs.multipage) {
      state.containsTable = true;
      tableInfo = getColumnWidths(table);
    }

    let before;
    let after;
    if (node.attrs.landscape) {
      // requires pdflscape package to be loaded
      before = '\\begin{landscape}';
      after = '\\end{landscape}';
    }
    // TODO for longtable to work with two columns we need to flip out to single column first
    // and then back to multi column, if we were in multicolumn mode
    // Q: we can know if we are in a two column mode from the template we are using, but how is this made available at this level?

    return {
      command: state.containsTable && node.attrs.multipage ? 'longtable' : nodeToCommand(node),
      commandOpts: state.containsTable && tableInfo ? tableInfo.columnSpec : undefined,
      bracketOpts: state.containsTable ? undefined : nodeToLaTeXOptions(node),
      before,
      after,
    };
  },
  (state, node) => {
    // if the figure is in a table, skip to child content
    if (state.isInTable) {
      state.renderContent(node);
      return;
    }

    const { numbered, id, multipage } = node.attrs as Attrs;
    const localId = state.options.localizeId?.(id ?? '') ?? id ?? undefined;

    // TODO: Based on align attr
    // may have to modify string returned by state.renderContent(n);
    // https://tex.stackexchange.com/questions/91566/syntax-similar-to-centering-for-right-and-left

    // centering does not work in a longtable environment
    if (!multipage || !state.containsTable) state.write('\\centering');
    state.ensureNewLine();
    // Pass the relevant information to the child nodes
    state.nextCaptionNumbered = numbered;
    state.nextCaptionId = localId;
    state.longFigure = multipage;
    state.renderContent(node);
    state.longFigure = undefined;
    state.containsTable = false;
  },
);

export default figure;
