import type { MarkdownSerializer } from 'prosemirror-markdown';
import { MarkdownSerializerState } from 'prosemirror-markdown';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { isPlainURL, backticksFor, wrapMark } from './utils';
import * as nodes from '../../nodes';
import type { MarkdownOptions, MdSerializerState } from '../types';
import { cleanWhitespaceChars } from '../clean';
import { toMdastSnippet } from '../mdast';
import { nodeNames } from '../../types';

type MarkdownSerializerParameters = ConstructorParameters<typeof MarkdownSerializer>;

function mdPostProcess(md: string): string {
  // Replace trailing newlines in code fences
  const post = md.replace(/\n\n```($|\n)/g, '\n```\n').replace(/```\n$/g, '```');
  return post;
}

const mdNodes: MarkdownSerializerParameters[0] = {
  text(state, node) {
    state.text(cleanWhitespaceChars(node.text ?? ''));
  },
  [nodeNames.block](state, node) {
    state.text('not supported!!');
  },
  paragraph(state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  heading: nodes.Heading.toMarkdown,
  blockquote(state, node) {
    state.wrapBlock('> ', null, node, () => state.renderContent(node));
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
    state.renderList(node, '  ', () => `${node.attrs.bullet || '-'} `);
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
  link_block: nodes.LinkBlock.toMarkdown,
  // Technical
  math: nodes.Math.toMarkdown,
  equation: nodes.Equation.toMarkdown,
  cite: nodes.Cite.toMarkdown,
  cite_group: nodes.CiteGroup.toMarkdown,
  mention: nodes.Mention.toMarkdown,
  // Tables
  table: nodes.Table.toMarkdown,
  // Dynamic
  variable: nodes.Variable.toMarkdown,
  display: nodes.Display.toMarkdown,
  dynamic: nodes.Dynamic.toMarkdown,
  range: nodes.Range.toMarkdown,
  switch: nodes.Switch.toMarkdown,
  button: nodes.Button.toMarkdown,
};
const mdMarks: MarkdownSerializerParameters[1] = {
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
    open(state, mark, parent, index) {
      const { options } = state as MdSerializerState;
      const href = options.localizeLink?.(mark.attrs.href) ?? mark.attrs.href;
      return isPlainURL(mark, href, parent, index, 1) ? '<' : '[';
    },
    close(state, mark, parent, index) {
      const { options } = state as MdSerializerState;
      const href = options.localizeLink?.(mark.attrs.href) ?? mark.attrs.href;
      return isPlainURL(mark, href, parent, index, -1)
        ? '>'
        : `](${state.esc(mark.attrs.href)}${
            mark.attrs.title ? ` ${(state as any).quote(mark.attrs.title)}` : ''
          })`;
    },
  },
  code: {
    open(state, mark, parent, index) {
      return backticksFor(parent.child(index), -1);
    },
    close(state, mark, parent, index) {
      return backticksFor(parent.child(index - 1), 1);
    },
    escape: false,
  },
  abbr: wrapMark('abbr', (state, mark) => (mark.attrs.title ? ` (${mark.attrs.title})` : '')),
  subscript: wrapMark('sub'),
  superscript: wrapMark('sup'),
  strikethrough: wrapMark('strike'),
  underline: wrapMark('u'),
};

export function toMyst(doc: ProsemirrorNode, opts?: MarkdownOptions) {
  const defualtOpts: MarkdownOptions = { tightLists: true };
  const state = new (MarkdownSerializerState as any)(mdNodes, mdMarks, {
    ...defualtOpts,
    ...opts,
  }) as MdSerializerState;
  state.mdastSerializer = (d) => toMdastSnippet(d, opts);
  state.renderContent(doc);
  const post = mdPostProcess(state.out as string);
  return { content: post, mdastSnippets: state.mdastSnippets ?? {} };
}

// TODO: GFM, CommonMark, etc!

export function toMarkdown(doc: ProsemirrorNode, opts?: MarkdownOptions) {
  const myst = toMyst(doc, opts);
  return myst.content;
}
