import { Node } from 'prosemirror-model';
import { DEFAULT_IMAGE_WIDTH } from '../defaults';
import { MdSerializerState, nodeNames } from '../types';
import { clamp, createId } from '../utils';
import { NodeSpecAttrs, NumberedNode } from './types';

export const getImageWidth = (width?: number | string | null) => {
  if (typeof width === 'number') {
    return clamp(width, 10, 100);
  }
  const widthNum = Number.parseInt((width ?? String(DEFAULT_IMAGE_WIDTH)).replace('%', ''), 10);
  return clamp(widthNum || DEFAULT_IMAGE_WIDTH, 10, 100);
};

export function readBooleanAttr(val?: string | boolean | null): boolean {
  if (val == null) return false;
  if (typeof val === 'boolean') return val;
  if (val?.toLowerCase() === 'false') return false;
  return true;
}

export function readBooleanDomAttr(dom: HTMLElement, attr: string): boolean {
  return readBooleanAttr(dom.getAttribute(attr));
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

// TODO query the table node for it's width
export const TOTAL_TABLE_WIDTH = 886;

export function renderPColumn(width: number) {
  if (width === 1) return `p{\\dimexpr \\linewidth-2\\tabcolsep}`;
  return `p{\\dimexpr ${width.toFixed(3)}\\linewidth-2\\tabcolsep}`;
}

/**
 * given a table node, return the column widths
 *
 * @param node  - node.type.name === 'table'
 * @returns
 */
export function getColumnWidths(node: Node<any>) {
  // TODO: unsure about rowspans
  let bestMaybeWidths = [];
  let mostNonNulls = 0;
  for (let i = 0; i < (node.content as any).content.length; i += 1) {
    const row = (node.content as any).content[i];
    const maybeWidths = row.content.content.reduce((acc: number[], cell: any) => {
      const colwidth = new Array(cell.attrs?.colspan ?? 1).fill(
        cell.attrs?.colwidth ? cell.attrs.colwidth / cell.attrs.colspan : null,
      );
      return [...acc, ...colwidth];
    }, []);
    const nonNulls = maybeWidths.filter((maybeWidth: number) => maybeWidth > 0).length;
    if (i === 0 || nonNulls >= mostNonNulls) {
      mostNonNulls = nonNulls;
      bestMaybeWidths = maybeWidths;
      if (mostNonNulls === maybeWidths.length) {
        break;
      }
    }
  }

  let widths;
  if (mostNonNulls === bestMaybeWidths.length) {
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
  }
  const total = widths.reduce((acc: number, cur: number) => acc + cur, 0);
  const fractionalWidths = widths.map((w: number) => w / total);
  const columnSpec = fractionalWidths.map((w: number) => renderPColumn(w)).join('');

  const numColumns =
    widths.length > 0 ? widths.length : node?.content?.firstChild?.content.childCount ?? 0;

  return { widths: fractionalWidths, columnSpec, numColumns };
}

/** Given a node, return true if there is a fancy table descendent
 *
 * "fancy" means there are table_cells or table_headers with
 * colspan or rowspan > 1.
 */
export function hasFancyTable(node: Node) {
  let hasRowspan = false;
  let hasColspan = false;
  node.descendants((n) => {
    if (n.type.name === nodeNames.table_cell || n.type.name === nodeNames.table_header) {
      hasRowspan = hasRowspan || (n.attrs.rowspan && Number(n.attrs.rowspan) > 1);
      hasColspan = hasColspan || (n.attrs.colspan && Number(n.attrs.colspan) > 1);
    }
  });
  return hasRowspan || hasColspan;
}

export function addMdastSnippet(state: MdSerializerState, node: Node): string | false {
  if (!state.mdastSnippets) state.mdastSnippets = {};
  if (!state.mdastSerializer) return false;
  const id = state.options.createMdastImportId?.() ?? createId();
  state.mdastSnippets[id] = state.mdastSerializer(node);
  return id;
}

export function writeMdastSnippet(state: MdSerializerState, node: Node): boolean {
  const mdastId = addMdastSnippet(state, node);
  if (mdastId === false) {
    // If the mdast writer isn't defined (it usually is!)
    state.write('No mdast writer attached.');
    state.closeBlock(node);
    return false; // maybe better?
  }
  state.write(`\`\`\`{mdast} ${mdastId}`);
  state.ensureNewLine();
  state.write('```');
  state.closeBlock(node);
  return true;
}

// TODO: this is directly from mystjs - we should export from there instead
export function normalizeLabel(
  label?: string | null,
): { identifier: string; label: string } | undefined {
  if (!label) return undefined;
  const identifier = label
    .replace(/[\t\n\r ]+/g, ' ')
    .trim()
    .toLowerCase();
  return { identifier, label };
}
