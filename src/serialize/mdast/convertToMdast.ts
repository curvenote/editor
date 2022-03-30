import {
  DOMOutputSpec,
  DOMSerializer,
  Mark,
  Node as ProsemirrorNode,
  Schema,
} from 'prosemirror-model';
import { Root } from 'mdast';
import { GenericNode } from 'mystjs';
import { createDocument, Fragment, Node, Text } from './document';
import { Component, NodesAndMarks } from './types';

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

export function nodeToMdast(fragment: (Node | Text)[], replacements: NodesAndMarks): GenericNode[] {
  if (fragment.length === 0) return [];
  return fragment.map((node) => {
    if (node instanceof Node) {
      const custom = replacements[node.name as keyof NodesAndMarks] as Component | undefined;
      const children = nodeToMdast(node.children, replacements);
      if (custom) {
        return custom({ key: node.id, tag: node.tag, name: node.name, ...node.attrs, children });
      }
      throw new Error(`Node for "${node.name}" is not defined.`);
    }
    return { type: 'text', value: node.text };
  });
}

export function convertToMdast(
  node: ProsemirrorNode,
  schema: Schema,
  replacements: NodesAndMarks,
): Root {
  const serializer = getSerializer(schema);
  const dom = serializer.serializeFragment(node.content, {
    document: createDocument(),
  }) as unknown as Fragment;
  return { type: 'root', children: nodeToMdast(dom.children, replacements) } as Root;
}

// TODO: this is directly from mystjs - we should export from there instead
export function normalizeLabel(
  label: string | undefined,
): { identifier: string; label: string } | undefined {
  if (!label) return undefined;
  const identifier = label
    .replace(/[\t\n\r ]+/g, ' ')
    .trim()
    .toLowerCase();
  return { identifier, label };
}
