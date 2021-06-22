import { DEFAULT_IMAGE_WIDTH } from '../defaults';
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
    numbered: attrs.numbered ? '' : undefined,
    label: attrs.label || undefined,
  };
}
