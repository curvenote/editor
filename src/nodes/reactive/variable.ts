import { NodeGroups, NodeDef } from '../types';
import { MdFormatSerialize } from '../../serialize/types';
import { createAttr as attr, createSpec, DEFAULT_FORMAT, nodeToMystDirective } from './utils';
import { VariableMystNode } from './myst-ext';

export type Attrs = {
  name: string;
  value?: string;
  valueFunction?: string;
  format?: string;
};

export const def: NodeDef = {
  tag: 'r-var',
  name: 'r:var',
  mystType: 'reactiveVariable',
  attrs: [attr('name', false, false), attr('value'), attr('format', false, DEFAULT_FORMAT)],
  inline: false,
  group: NodeGroups.top,
};

const spec = createSpec<VariableMystNode>(def);
export const toMarkdown: MdFormatSerialize = (state, node) => nodeToMystDirective(state, node, def);
export default spec;
