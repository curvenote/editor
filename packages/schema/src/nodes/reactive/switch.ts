import type { NodeDef } from '../types';
import { NodeGroups } from '../types';
import type { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';
import type { Switch } from '../../spec';

export type Attrs = {
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  label?: string;
};

export const def: NodeDef = {
  tag: 'r-switch',
  name: 'r:switch',
  mystType: 'reactiveSwitch',
  attrs: [attr('value'), attr('change', 'only'), attr('label', false)],
  inline: true,
  group: NodeGroups.inline,
};

export const spec = createSpec<Switch>(def);
export const toMarkdown: MdFormatSerialize = (state, node) => nodeToMystRole(state, node, def);
export default spec;
