import type { NodeGroup } from '../types';
import { LEGACY_NODE_GROUPS } from '../types';
import type { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';
import type { Display } from '../../spec';
import { buildDef } from '../utils';

export type Attrs = {
  value?: string;
  valueFunction?: string;
  format?: string;
  transformFunction?: string;
};

const def = {
  tag: 'r-display',
  name: 'r:display',
  mystType: 'reactiveDisplay',
  attrs: [attr('value'), attr('format', false), attr('transform', 'only', '')],
  inline: true,
};
export function createNodeSpec(nodeGroup: NodeGroup) {
  return createSpec<Display>(buildDef(nodeGroup, def));
}

export const toMarkdown: MdFormatSerialize = (state, node) =>
  nodeToMystRole(state, node, buildDef(LEGACY_NODE_GROUPS, def));
