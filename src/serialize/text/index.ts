import { MarkdownSerializer, MarkdownSerializerState } from 'prosemirror-markdown';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import * as nodes from '../../nodes';
import { cleanWhitespaceChars } from '../clean';

function simpleInlineRender(state: MarkdownSerializerState, node: ProsemirrorNode) {
  state.renderInline(node);
}

function simpleBlockRender(state: MarkdownSerializerState, node: ProsemirrorNode) {
  state.renderInline(node);
  state.closeBlock(node);
}

function newLine(state: MarkdownSerializerState) {
  state.ensureNewLine();
}

function nothing() {
  // pass
}

const noMarks = {
  open: '',
  close: '',
  mixable: true,
};

export const textSerializer = new MarkdownSerializer(
  {
    text(state, node) {
      state.text(cleanWhitespaceChars(node.text ?? ''), false);
    },
    paragraph: simpleBlockRender,
    heading: simpleBlockRender,
    blockquote: simpleBlockRender,
    code_block: simpleBlockRender,
    footnote: simpleBlockRender,
    horizontal_rule: newLine,
    hard_break: newLine,
    ordered_list(state, node) {
      const start = node.attrs.order || 1;
      const maxW = String(start + node.childCount - 1).length;
      const space = state.repeat(' ', maxW + 2);
      state.renderList(node, space, (i) => {
        const nStr = String(start + i);
        return `${state.repeat(' ', maxW - nStr.length) + nStr}. `;
      });
    },
    bullet_list(state, node) {
      state.renderList(node, '  ', () => `${node.attrs.bullet || '*'} `);
    },
    list_item(state, node) {
      state.renderInline(node);
    },
    // Presentational
    image: newLine,
    iframe: newLine,
    figure: simpleBlockRender,
    figcaption: simpleBlockRender,
    time: nodes.Time.toMarkdown, // This is just the time! :)
    callout: simpleBlockRender,
    aside: simpleBlockRender,
    // Technical
    math: simpleInlineRender,
    equation: simpleBlockRender,
    cite: nodes.Cite.toMarkdown, // TODO: fix this
    cite_group: nodes.CiteGroup.toMarkdown, // TODO: fix this
    mention: nodes.Mention.toMarkdown,
    // Tables
    table: nodes.Table.toMarkdown,
    // Dynamic
    variable: newLine,
    display: nodes.Display.toMarkdown, // TODO: fix this
    dynamic: nodes.Dynamic.toMarkdown, // TODO: fix this
    range: nothing,
    switch: nothing,
    button: nothing,
  },
  {
    em: noMarks,
    strong: noMarks,
    link: noMarks,
    code: noMarks,
    abbr: noMarks,
    subscript: noMarks,
    superscript: noMarks,
    strikethrough: noMarks,
    underline: noMarks,
  },
);

export function toText(doc: ProsemirrorNode) {
  const md = textSerializer.serialize(doc, { tightLists: true });
  return md;
}
