import { NodeDef, NodeGroups } from '../types';
import { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';
import { ButtonMystNode } from './myst-ext';

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
  mystType: 'reactiveButton',
  attrs: [attr('label', true, 'Click Here'), attr('click', 'only'), attr('disabled')],
  inline: true,
  group: NodeGroups.inline,
};

export const spec = createSpec<ButtonMystNode>(def);
export const toMarkdown: MdFormatSerialize = (state, node) => nodeToMystRole(state, node, def);
export default spec;
