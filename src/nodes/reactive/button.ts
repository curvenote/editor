import { NodeDef, NodeGroups } from '../types';
import { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';

export type Attrs = {
  label?: string;
  labelFunction?: string;
  disabled?: string;
  disabledFunction?: string;
  clickFunction?: string;
};

export const def: NodeDef = {
  tag: 'r-button',
  name: 'r:button',
  attrs: [attr('label', true, 'Click Here'), attr('click', 'only'), attr('disabled')],
  inline: true,
  group: NodeGroups.inline,
};

export const spec = createSpec(def);
export const toMarkdown: MdFormatSerialize = (state, node) => nodeToMystRole(state, node, def);
export default spec;
