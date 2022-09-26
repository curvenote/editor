import type { NodeGroup } from '../types';
import { LEGACY_NODE_GROUPS } from '../types';
import type { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';
import { buildDef } from '../utils';

export type Attrs = {
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  label?: string;
};

const def = {
  tag: 'r-switch',
  name: 'r:switch',
  mystType: 'reactiveSwitch',
  attrs: [attr('value'), attr('change', 'only'), attr('label', false)],
  inline: true,
};
export function createNodeSpec(nodeGroup: NodeGroup) {
  return createSpec(buildDef(nodeGroup, def));
}

export const toMarkdown: MdFormatSerialize = (state, node) =>
  nodeToMystRole(state, node, buildDef(LEGACY_NODE_GROUPS, def));
