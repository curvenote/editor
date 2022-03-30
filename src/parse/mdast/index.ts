import { Fragment, Mark, Node as ProsemirrorNode, NodeType, Schema } from 'prosemirror-model';
import { Root } from 'mdast';
import { GenericNode } from 'mystjs';
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
  paragraph(state, token, tokens, index) {
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
