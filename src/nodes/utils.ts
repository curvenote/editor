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

const TOTAL_TABLE_WIDTH = 886;

export function renderPColumn(factor: number, width: number) {
  return `p{${(factor * width).toFixed(5)}\\linewidth}`;
}

/**
 * given a table node, return the column widths
 *
 * @param node  - node.type.name === 'table'
 * @returns
 */
export function getColumnWidths(node: Node<any>, verticalSeparator = true) {
  // TODO NOT working for colspans in the first row
  // TODO: unsure about rowspans
  let bestMaybeWidths = [];
  let mostNonNulls = 0;
  for (let i = 0; i < (node.content as any).content.length; i += 1) {
    const row = (node.content as any).content[i];
    const maybeWidths = row.content.content.reduce((acc: number[], cell: any) => {
      if (cell.attrs.colwidth == null) return [...acc, null];
      return [...acc, ...cell.attrs.colwidth];
    }, []);
    const nonNulls = maybeWidths.filter((maybeWidth: number) => maybeWidth > 0).length;
    if (i === 0 || nonNulls > mostNonNulls) {
      mostNonNulls = nonNulls;
      bestMaybeWidths = maybeWidths;
      if (mostNonNulls === maybeWidths.length) {
        break;
      }
    }
  }

  let widths;
  if (mostNonNulls === bestMaybeWidths.length) {
    // eslint-disable-next-line no-console
    console.debug('using best widths', bestMaybeWidths);
    widths = bestMaybeWidths;
  } else {
    // need to fill in the null colwidths
    const totalDefinedWidths = bestMaybeWidths.reduce(
      (acc: number, cur: number | null) => (cur == null ? acc : acc + cur),
      0,
    );
    const remainingSpace = TOTAL_TABLE_WIDTH - totalDefinedWidths;
    const nullCells = bestMaybeWidths.length - mostNonNulls;
    const defaultWidth = Math.floor(remainingSpace / nullCells);
    widths = bestMaybeWidths.map((w: number) => (w == null || w === 0 ? defaultWidth : w));
    // eslint-disable-next-line no-console
    console.debug('using some default widths', defaultWidth, widths);
  }
  const total = widths.reduce((acc: number, cur: number) => acc + cur, 0);

  const fractionalWidths = widths.map((w: number) => w / total);
  const factor = 0.9;
  let columnSpec = fractionalWidths
    .map((w: number) => renderPColumn(factor, w))
    .join(verticalSeparator ? '|' : '');
  if (verticalSeparator) {
    columnSpec = `|${columnSpec}|`;
  }
  const numColumns =
    widths.length > 0 ? widths.length : node?.content?.firstChild?.content.childCount;

  return { widths: fractionalWidths, columnSpec, numColumns };
}
