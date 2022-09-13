import type { NodeGroup } from '../types';
import { LEGACY_NODE_GROUPS } from '../types';
import type { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, createSpec, DEFAULT_FORMAT, nodeToMystDirective } from './utils';
import { buildDef } from '../utils';

export type Attrs = {
  name: string;
  value?: string;
  valueFunction?: string;
  format?: string;
};

export const def = {
  tag: 'r-var',
  name: 'r:var',
  mystType: 'reactiveVariable',
  attrs: [attr('name', false, false), attr('value'), attr('format', false, DEFAULT_FORMAT)],
  inline: false,
};

export function createNodeSpec(nodeGroup: NodeGroup) {
  return createSpec(buildDef(nodeGroup, def, 'top'));
}
export const toMarkdown: MdFormatSerialize = (state, node) =>
  nodeToMystDirective(state, node, buildDef(LEGACY_NODE_GROUPS, def));
