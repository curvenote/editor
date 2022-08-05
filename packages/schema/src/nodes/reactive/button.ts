import type { NodeDef } from '../types';
import { NodeGroups } from '../types';
import type { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';
import type { Button } from '../../spec';

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

export const spec = createSpec<Button>(def);
export const toMarkdown: MdFormatSerialize = (state, node) => nodeToMystRole(state, node, def);
export default spec;
