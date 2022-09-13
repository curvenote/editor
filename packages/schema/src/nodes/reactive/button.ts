import type { NodeGroup } from '../types';
import { LEGACY_NODE_GROUPS } from '../types';
import type { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';
import { buildDef } from '../utils';

export type Attrs = {
  label?: string;
  labelFunction?: string;
  disabled?: string;
  disabledFunction?: string;
  clickFunction?: string;
};

const def = {
  tag: 'r-button',
  name: 'r:button',
  mystType: 'reactiveButton',
  attrs: [attr('label', true, 'Click Here'), attr('click', 'only'), attr('disabled')],
  inline: true,
};
export function createNodeSpec(nodeGroup: NodeGroup) {
  return createSpec(buildDef(nodeGroup, def));
}

export const toMarkdown: MdFormatSerialize = (state, node) =>
  nodeToMystRole(state, node, buildDef(LEGACY_NODE_GROUPS, def));
