import { Fragment, Mark, Node as ProsemirrorNode, NodeType, Schema } from 'prosemirror-model';
import { Root } from 'mdast';
import { GenericNode } from 'mystjs';
import { nodeNames } from '../..';
import { getSchema, UseSchema } from '../../schemas';

type Attrs = Record<string, any>;
type ProtoNode = {
  type: NodeType;
  attrs: Attrs;
  content: (ProtoNode | ProsemirrorNode)[];
};

function maybeMerge(a?: ProsemirrorNode, b?: ProsemirrorNode) {
  if (!a || !b) return undefined;
  if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) return undefined; // a.withText(a.text + b.text);
  return undefined;
}

/** MarkdownParseState tracks the context of a running token stream.
 *
 * Loosly based on prosemirror-markdown
 */
export class MarkdownParseState {
  schema: Schema;

  marks: Mark[];

  stack: ProtoNode[];

  handlers: Record<string, TokenHandler>;

  constructor(schema: Schema, handlers: Record<string, TokenHandler>) {
    this.schema = schema;
    this.stack = [{ type: schema.topNodeType, attrs: {}, content: [] }];
    this.marks = Mark.none;
    this.handlers = handlers;
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  addNode(
    type: NodeType,
    attrs: Attrs,
    content: ProsemirrorNode<any> | Fragment<any> | ProsemirrorNode<any>[] | undefined,
  ) {
    const top = this.top();
    const node = type.createAndFill(attrs, content, this.marks);
    if (this.stack.length && node && 'content' in top) top.content.push(node);
    return node;
  }

  addText(text?: string) {
    const top = this.top();
    const value = text;
    if (!value || !this.stack.length || !('content' in top)) return;
    const last = top.content?.[top.content.length - 1];
    const node = this.schema.text(text, this.marks);
    const merged = maybeMerge(last as ProsemirrorNode, node);
    top.content?.push(merged || node);
  }

  // : (Mark)
  // Adds the given mark to the set of active marks.
  openMark(mark: Mark) {
    this.marks = mark.addToSet(this.marks);
  }

  // : (Mark)
  // Removes the given mark from the set of active marks.
  closeMark(mark: Mark) {
    this.marks = mark.removeFromSet(this.marks);
  }

  openNode(type: NodeType, attrs: Record<string, any>) {
    this.stack.push({ type, attrs, content: [] });
  }

  closeNode() {
    const node = this.stack.pop();
    if (!node) return undefined;
    return this.addNode(node.type, node.attrs, node.content as ProsemirrorNode[]);
  }

  parseTokens(tokens?: GenericNode[] | null) {
    tokens?.forEach((token, index) => {
      if (token.hidden) return;
      const handler = this.handlers[token.type];
      if (!handler)
        throw new Error(`Token type \`${token.type}\` not supported by tokensToMyst parser`);
      handler(this, token, tokens, index);
    });
  }
}

type TokenHandler = (
  state: MarkdownParseState,
  token: GenericNode,
  tokens: GenericNode[],
  index: number,
) => void;

// type MdastHandler = {
//   block: string;
//   getAttrs?: (node: GenericNode) => Record<string, any>;
// };

const handlers: Record<string, TokenHandler> = {
  text(state, token) {
    state.addText(token.value);
  },
  paragraph(state, token) {
    state.openNode(state.schema.nodes.paragraph, {});
    state.parseTokens(token.children);
    state.closeNode();
  },
  abbreviation(state, token) {
    const mark = state.schema.marks.abbr.create({ title: token.title });
    state.openMark(mark);
    state.parseTokens(token.children);
    state.closeMark(mark);
  },
  thematicBreak(state) {
    state.openNode(state.schema.nodes.horizontal_rule, {});
    state.closeNode();
  },
  break(state) {
    state.openNode(state.schema.nodes.hard_break, {});
    state.closeNode();
  },
  heading(state, token) {
    state.openNode(state.schema.nodes.heading, { level: token.depth });
    state.parseTokens(token.children);
    state.closeNode();
  },
  link(state, token) {
    const mark = state.schema.marks.link.create({ href: token.url, title: token.title });
    state.openMark(mark);
    state.parseTokens(token.children);
    state.closeMark(mark);
  },
  emphasis(state, token) {
    const mark = state.schema.marks.em.create({});
    state.openMark(mark);
    state.parseTokens(token.children);
    state.closeMark(mark);
  },
  strong(state, token) {
    const mark = state.schema.marks.strong.create({});
    state.openMark(mark);
    state.parseTokens(token.children);
    state.closeMark(mark);
  },
  subscript(state, token) {
    const mark = state.schema.marks.subscript.create({});
    state.openMark(mark);
    state.parseTokens(token.children);
    state.closeMark(mark);
  },
  superscript(state, token) {
    const mark = state.schema.marks.superscript.create({});
    state.openMark(mark);
    state.parseTokens(token.children);
    state.closeMark(mark);
  },
  blockquote(state, token) {
    state.openNode(state.schema.nodes.blockquote, {});
    state.parseTokens(token.children);
    state.closeNode();
  },
  inlineCode(state, token) {
    const mark = state.schema.marks.code.create({});
    state.openMark(mark);
    state.addText(token.value);
    state.closeMark(mark);
  },
  code(state, token) {
    state.openNode(state.schema.nodes.code_block, {
      language: token.lang,
      linenumbers: token.showLineNumbers,
    });
    state.addText(token.value);
    state.closeNode();
  },
  list(state, token) {
    if (token.ordered) {
      state.openNode(state.schema.nodes.ordered_list, { order: token.start || 1 });
    } else {
      state.openNode(state.schema.nodes.bullet_list, {});
    }
    state.parseTokens(token.children);
    state.closeNode();
  },
  listItem(state, token) {
    state.openNode(state.schema.nodes.list_item, {});
    if (token.children?.length === 1 && token.children[0].type === 'text') {
      state.parseTokens([{ type: 'paragraph', children: token.children }]);
    } else {
      state.parseTokens(token.children);
    }
    state.closeNode();
  },
  inlineMath(state, token) {
    state.openNode(state.schema.nodes.math, {});
    state.addText(token.value);
    state.closeNode();
  },
  math(state, token) {
    const id = token.label || undefined;
    state.openNode(state.schema.nodes.equation, {
      id,
      numbered: Boolean(id),
    });
    state.addText(token.value);
    state.closeNode();
  },
  container(state, token) {
    const id = token.label || undefined;
    const match = token.class?.match(/align-(left|right|center)/);
    state.openNode(state.schema.nodes.figure, {
      id,
      numbered: Boolean(id),
      align: match ? match[1] : undefined,
    });
    state.parseTokens(token.children);
    state.closeNode();
  },
  caption(state, token, tokens) {
    const adjacentTypes = tokens.map((t) => t.type);
    state.openNode(state.schema.nodes.figcaption, {
      kind: adjacentTypes.includes(nodeNames.table) ? 'table' : 'fig',
    });
    state.parseTokens(token.children);
    state.closeNode();
  },
  image(state, token) {
    state.openNode(state.schema.nodes.image, {
      src: token.url,
      alt: token.alt || undefined,
      title: token.title || undefined,
      width: token.width || undefined,
    });
    state.closeNode();
  },
  table(state, token) {
    state.openNode(state.schema.nodes.table, {});
    state.parseTokens(token.children);
    state.closeNode();
  },
  tableRow(state, token) {
    state.openNode(state.schema.nodes.table_row, {});
    state.parseTokens(token.children);
    state.closeNode();
  },
  tableCell(state, token) {
    state.openNode(
      token.header ? state.schema.nodes.table_header : state.schema.nodes.table_cell,
      {},
    );
    state.parseTokens(token.children);
    state.closeNode();
  },
  admonition(state, token) {
    state.openNode(state.schema.nodes.callout, { kind: token.kind });
    state.parseTokens(token.children);
    state.closeNode();
  },
};

export function fromMdast(tree: Root, useSchema: UseSchema): ProsemirrorNode {
  const schema = getSchema(useSchema);

  const state = new MarkdownParseState(schema, handlers);
  state.parseTokens(tree.children as GenericNode[]);
  let doc: ProsemirrorNode | undefined;
  do {
    doc = state.closeNode() as ProsemirrorNode;
  } while (state.stack.length);
  return doc;
}
