import { NodeDef, NodeGroups, FormatMarkdown } from '../types';
import { createAttr as attr, nodeToMystRole, createSpec } from '../../utils';

export type Attrs = {
  value?: string;
  valueFunction?: string;
  format?: string;
};

export const def: NodeDef = {
  tag: 'r-display',
  name: 'display',
  attrs: [
    attr('value'),
    attr('format', false),
  ],
  inline: true,
  group: NodeGroups.inline,
};

export const spec = createSpec(def);
export const toMarkdown: FormatMarkdown = (state, node) => nodeToMystRole(state, node, def);
export default spec;
