import { MarkdownSerializer } from 'prosemirror-markdown';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { isPlainURL, backticksFor, wrapMark } from './utils';
import * as nodes from '../../nodes';
import { MarkdownOptions } from '../types';

export function mdPostProcess(md: string): string {
  // Replace trailing newlines in code fences
  const post = md.replace(/\n\n```($|\n)/g, '\n```\n').replace(/```\n$/g, '```');
  return post;
}

export const markdownSerializer = new MarkdownSerializer(
  {
    text(state, node) {
      state.text(node.text ?? '');
    },
    paragraph(state, node) {
      state.renderInline(node);
      state.closeBlock(node);
    },
    heading: nodes.Heading.toMarkdown,
    blockquote(state, node) {
      state.wrapBlock('> ', undefined, node, () => state.renderContent(node));
    },
    code_block: nodes.Code.toMarkdown,
    horizontal_rule(state, node) {
      state.write(node.attrs.markup || '---');
      state.closeBlock(node);
    },
    hard_break(state, node, parent, index) {
      for (let i = index + 1; i < parent.childCount; i += 1) {
        if (parent.child(i).type !== node.type) {
          state.write('\\\n');
          return;
        }
      }
    },
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
    image: nodes.Image.toMarkdown,
    figure: nodes.Figure.toMarkdown,
    figcaption: nodes.Figcaption.toMarkdown,
    footnote: nodes.Footnote.toMarkdown,
    iframe: nodes.IFrame.toMarkdown,
    time: nodes.Time.toMarkdown,
    callout: nodes.Callout.toMarkdown,
    aside: nodes.Aside.toMarkdown,
    // Technical
    math: nodes.Math.toMarkdown,
    equation: nodes.Equation.toMarkdown,
    cite: nodes.Cite.toMarkdown,
    cite_group: nodes.CiteGroup.toMarkdown,
    mention: nodes.Mention.toMarkdown, // TODO: fix this
    // Tables
    table: nodes.Table.toMarkdown,
    // Dynamic
    variable: nodes.Variable.toMarkdown,
    display: nodes.Display.toMarkdown,
    dynamic: nodes.Dynamic.toMarkdown,
    range: nodes.Range.toMarkdown,
    switch: nodes.Switch.toMarkdown,
    button: nodes.Button.toMarkdown,
  },
  {
    em: {
      open: '*',
      close: '*',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    strong: {
      open: '**',
      close: '**',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    link: {
      open(_state, mark, parent, index) {
        return isPlainURL(mark, parent, index, 1) ? '<' : '[';
      },
      close(state, mark, parent, index) {
        return isPlainURL(mark, parent, index, -1)
          ? '>'
          : `](${state.esc(mark.attrs.href)}${
              mark.attrs.title ? ` ${state.quote(mark.attrs.title)}` : ''
            })`;
      },
    },
    code: {
      open(_state, _mark, parent, index) {
        return backticksFor(parent.child(index), -1);
      },
      close(_state, _mark, parent, index) {
        return backticksFor(parent.child(index - 1), 1);
      },
      escape: false,
    },
    abbr: wrapMark('abbr', (state, mark) => (mark.attrs.title ? ` (${mark.attrs.title})` : '')),
    subscript: wrapMark('sub'),
    superscript: wrapMark('sup'),
    strikethrough: wrapMark('strike'),
    underline: wrapMark('u'),
  },
);

export function toMarkdown(doc: ProsemirrorNode, opts?: MarkdownOptions) {
  const defualtOpts = { tightLists: true };
  const md = markdownSerializer.serialize(doc, { ...defualtOpts, ...opts });
  const post = mdPostProcess(md);
  return post;
}
