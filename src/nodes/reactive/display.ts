import { NodeDef, NodeGroups } from '../types';
import { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';

export type Attrs = {
  value?: string;
  valueFunction?: string;
  format?: string;
  transformFunction?: string;
};

export const def: NodeDef = {
  tag: 'r-display',
  name: 'r:display',
  attrs: [attr('value'), attr('format', false), attr('transform', 'only', '')],
  inline: true,
  group: NodeGroups.inline,
};

export const spec = createSpec(def);
export const toMarkdown: MdFormatSerialize = (state, node) => nodeToMystRole(state, node, def);
export default spec;
