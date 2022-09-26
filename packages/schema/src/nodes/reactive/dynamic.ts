import type { NodeGroup } from '../types';
import { LEGACY_NODE_GROUPS } from '../types';
import type { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';
import { buildDef } from '../utils';

export type Attrs = {
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  format?: string;
  min?: string;
  minFunction?: string;
  max?: string;
  maxFunction?: string;
  step?: string;
  stepFunction?: string;
};

const ref = {
  tag: 'r-dynamic',
  name: 'r:dynamic',
  mystType: 'reactiveDynamic',
  attrs: [
    attr('value'),
    attr('change', 'only'),
    attr('format', false),
    attr('min', true, '0'),
    attr('max', true, '100'),
    attr('step', true, '1'),
  ],
  inline: true,
};

export function createNodeSpec(nodeGroup: NodeGroup) {
  return createSpec(buildDef(nodeGroup, ref));
}

export const toMarkdown: MdFormatSerialize = (state, node) =>
  nodeToMystRole(state, node, buildDef(LEGACY_NODE_GROUPS, ref));
