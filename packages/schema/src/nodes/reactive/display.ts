import type { NodeDef } from '../types';
import { NodeGroups } from '../types';
import type { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, nodeToMystRole, createSpec } from './utils';
import type { Display } from '../../spec';

export type Attrs = {
  value?: string;
  valueFunction?: string;
  format?: string;
  transformFunction?: string;
};

export const def: NodeDef = {
  tag: 'r-display',
  name: 'r:display',
  mystType: 'reactiveDisplay',
  attrs: [attr('value'), attr('format', false), attr('transform', 'only', '')],
  inline: true,
  group: NodeGroups.inline,
};

export const spec = createSpec<Display>(def);
export const toMarkdown: MdFormatSerialize = (state, node) => nodeToMystRole(state, node, def);
export default spec;
