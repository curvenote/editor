import {
  DOMOutputSpec,
  DOMSerializer,
  Mark,
  Node as ProsemirrorNode,
  Schema,
} from 'prosemirror-model';
import { GenericNode, selectAll } from 'mystjs';
import {
  FootnoteReference,
  FootnoteDefinition,
  Root,
  Text as MystText,
  FlowContent,
  InlineFootnote,
} from '../../spec';
import { createDocument, Fragment, Node, Text } from './document';
import { markNames, nodeNames } from '../../types';
import { Props } from '../../nodes/types';
import { getSchema, UseSchema } from '../../schemas';
import { MdastOptions } from '../types';
import { createId } from '../../utils';

type CreateNodeSpec = (node: ProsemirrorNode) => DOMOutputSpec;
type CreateMarkSpec = (mark: Mark, inline: boolean) => DOMOutputSpec;

/**
 * This uses the DOMSerializer from prosemirror-model to serialize to html
 * The document used is a fake one that is passed to react.
 */
function getSerializer(schema: Schema): DOMSerializer {
  const nodes = Object.fromEntries(
    Object.entries(schema.nodes)
      .map(([k, nodeType]) => {
        const { toDOM } = nodeType.spec;
        if (!toDOM) return undefined;
        const wrapper: CreateNodeSpec = (node) => {
          const spec = toDOM(node) as any;
          return [`${node.type.name} ${spec[0]}`, ...spec.slice(1)];
        };
        return [k, wrapper];
      })
      .filter((v) => v) as [string, CreateNodeSpec][],
  );
  // We must include the text node!
  if (!nodes.text) nodes.text = (node) => node.text as string;
  const marks = Object.fromEntries(
    Object.entries(schema.marks)
      .map(([k, markType]) => {
        const { toDOM } = markType.spec;
        if (!toDOM) return undefined;
        const wrapper: CreateMarkSpec = (mark, inline) => {
          const spec = toDOM(mark, inline) as any;
          return [`${mark.type.name} ${spec[0]}`, ...spec.slice(1)];
        };
        return [k, wrapper];
      })
      .filter((v) => v) as [string, CreateMarkSpec][],
  );
  return new DOMSerializer(nodes, marks);
}

export function nodeToMdast(
  fragment: (Node | Text)[],
  schema: Schema,
  opts: MdastOptions,
): GenericNode[] {
  if (fragment.length === 0) return [];
  return fragment.map((node) => {
    if (node instanceof Node) {
      const children: GenericNode[] = nodeToMdast(node.children, schema, opts);
      const props: Props = {
        key: node.id,
        tag: node.tag,
        name: node.name,
        ...node.attrs,
        children,
      };
      if (node.name in nodeNames) {
        return schema.nodes[node.name].spec.toMyst(props, opts) as GenericNode;
      }
      if (node.name in markNames) {
        return schema.marks[node.name].spec.toMyst(props, opts) as GenericNode;
      }
      throw new Error(`Node for "${node.name}" is not defined.`);
    }
    const textNode: MystText = { type: 'text', value: node.text };
    return textNode as GenericNode;
  });
}

export function convertToMdast(node: ProsemirrorNode, opts: MdastOptions): Root {
  const schema = getSchema((opts.useSchema as UseSchema) || 'full');
  const serializer = getSerializer(schema);
  const dom = serializer.serializeFragment(node.content, {
    document: createDocument() as any,
  }) as unknown as Fragment;
  const root = { type: 'root', children: nodeToMdast(dom.children, schema, opts) } as Root;
  const footnotes = selectAll('inlineFootnote', root) as InlineFootnote[];
  const footnoteDefinitions: FootnoteDefinition[] = [];
  footnotes.forEach((footnote) => {
    const id = createId();
    footnoteDefinitions.push({
      type: 'footnoteDefinition',
      identifier: id,
      label: id,
      children: (footnote as GenericNode).children as FlowContent[],
    });
    delete (footnote as GenericNode).children;
    const ref = footnote as unknown as FootnoteReference;
    ref.type = 'footnoteReference';
    ref.identifier = id;
    ref.label = id;
  });
  root.children.push(...footnoteDefinitions);
  return root;
}

export function convertToMdastSnippet(node: ProsemirrorNode, opts: MdastOptions): GenericNode {
  if (node.type.name === 'doc') {
    throw new Error('The requested mdast snippet is a document, use convertToMdast.');
  }
  // If the node is not a top level, wrap it in a document and return that!
  const schema = getSchema((opts.useSchema as UseSchema) || 'full');
  const { doc } = schema.nodes;
  const wrapped = doc.create({}, [node]);
  return convertToMdast(wrapped, opts)?.children?.[0] as GenericNode;
}

export function transformNumericalFootnotes(root: Root): Root {
  const defLookup: Record<string, FootnoteDefinition> = {};
  const defs = selectAll('footnoteDefinition', root) as FootnoteDefinition[];
  defs.forEach((def) => {
    defLookup[def.identifier as string] = def;
  });
  const refs = selectAll('footnoteReference', root) as FootnoteReference[];
  refs.forEach((ref, index) => {
    const refDef = defLookup[ref.identifier as string];
    let id = String(index + 1);
    if (refDef.identifier !== ref.identifier) {
      id = refDef.identifier as string;
    }
    refDef.identifier = id;
    refDef.label = id;
    ref.identifier = id;
    ref.label = id;
  });

  return root;
}
