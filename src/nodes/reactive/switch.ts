import { NodeDef, NodeGroups } from '../types';
import { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';

export type Attrs = {
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  label?: string;
};

export const def: NodeDef = {
  tag: 'r-switch',
  name: 'r:switch',
  attrs: [attr('value'), attr('change', 'only'), attr('label', false)],
  inline: true,
  group: NodeGroups.inline,
};

export const spec = createSpec(def);
export const toMarkdown: MdFormatSerialize = (state, node) => nodeToMystRole(state, node, def);
export default spec;
