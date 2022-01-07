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
