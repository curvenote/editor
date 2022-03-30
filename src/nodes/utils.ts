import { Node } from 'prosemirror-model';
import { DEFAULT_IMAGE_WIDTH } from '../defaults';
import { nodeNames } from '../types';
import { clamp } from '../utils';
import { NodeSpecAttrs, NumberedNode } from './types';

export const getImageWidth = (width?: string | null) => {
  const widthNum = Number.parseInt((width ?? String(DEFAULT_IMAGE_WIDTH)).replace('%', ''), 10);
  return clamp(widthNum || DEFAULT_IMAGE_WIDTH, 10, 100);
};

export function readBooleanDomAttr(dom: HTMLElement, attr: string): boolean {
  if (!dom.hasAttribute(attr)) return false;
  const val = dom.getAttribute(attr);
  if (val?.toLowerCase() === 'false') return false;
  return true;
}

export function convertToBooleanAttribute(value: boolean) {
  return value ? '' : undefined;
}

export const getNumberedDefaultAttrs = (): NodeSpecAttrs<NumberedNode> => ({
  id: { default: null },
  label: { default: null },
  numbered: { default: false },
});

export function getAttr(dom: HTMLElement, name: string, defaultValue: any = '') {
  return dom.getAttribute(name) ?? defaultValue;
}

export function getNumberedAttrs(dom: HTMLElement): NumberedNode {
  return {
    id: dom.getAttribute('id') ?? null,
    numbered: readBooleanDomAttr(dom, 'numbered'),
    label: dom.getAttribute('label') ?? null,
  };
}
export function setNumberedAttrs(
  attrs: Record<string, any>,
): Record<keyof NumberedNode, string | undefined> {
  return {
    id: attrs.id || undefined,
    numbered: convertToBooleanAttribute(attrs.numbered),
    label: attrs.label || undefined,
  };
}

/**
 * @param node ProsemirrorNode
 * @param name Name of the node(s) to find
 * @param descend go through all children of the node, default=false is only direct children
 * @returns The first node with the name found
 */
export function getFirstChildWithName(
  node: Node,
  name: nodeNames | nodeNames[],
  descend = false,
): Node | null {
  const names = typeof name === 'string' ? new Set([name]) : new Set(name);
  let child: Node | null = null;
  node.descendants((n) => {
    if (!child && names.has(n.type.name as nodeNames)) {
      child = n;
    }
    return descend;
  });
  return child;
}

/**
 * given a table node, return the column widths
 *
 * @param node  - node.type.name === 'table'
 * @returns
 */
export function getColumnWidths(node: Node<any>, verticalSeparator = true) {
  // should work for colspans in the first row, as a colspanned cell has an array of the widths it spans
  // TODO: unsure about rowspans
  const maybeWidths = (node.content.firstChild?.content as any).content.reduce(
    (acc: number[], cell: any) => {
      if (cell.attrs.colwidth == null) return [...acc, null];
      return [...acc, ...cell.attrs.colwidth];
    },
    [],
  );
  const nonNulls = maybeWidths.filter((w: number) => w != null).length;
  const avg =
    nonNulls === 0
      ? 50
      : maybeWidths
          .map((w: number) => (w == null ? 0 : w))
          .reduce((a: number, b: number) => a + b, 0) / nonNulls;
  const widths = maybeWidths.map((w: number) => (w == null ? avg : w));
  const total = widths.reduce((acc: number, cur: number) => acc + cur, 0);
  const fractionalWidths = widths.map((w: number) => w / total);
  const factor = 0.9;
  const columnSpec = fractionalWidths
    .map((w: number) => `p{${(factor * w).toFixed(5)}\\textwidth}`)
    .join(verticalSeparator ? '|' : '');
  const numColumns =
    widths.length > 0 ? widths.length : node?.content?.firstChild?.content.childCount;

  return { widths, columnSpec, numColumns };
}
