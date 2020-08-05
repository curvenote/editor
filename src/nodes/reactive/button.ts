import { NodeDef, NodeGroups, FormatMarkdown } from '../types';
import { createAttr as attr, nodeToMystRole, createSpec } from '../../utils';

export type Attrs = {
  label?: string;
  labelFunction?: string;
  disabled?: string;
  disabledFunction?: string;
  clickFunction?: string;
};

export const def: NodeDef = {
  tag: 'r-button',
  name: 'button',
  attrs: [
    attr('label', true, 'Click Here'),
    attr('click', 'only'),
    attr('disabled'),
  ],
  inline: true,
  group: NodeGroups.inline,
};

export const spec = createSpec(def, (props) => {
  const out = { ...props };
  out.dense = '';
  out.outlined = '';
  return out;
});
export const toMarkdown: FormatMarkdown = (state, node) => nodeToMystRole(state, node, def);
export default spec;
