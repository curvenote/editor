import { NodeSpec } from 'prosemirror-model';
import { NodeGroups } from './types';

export type VariableAttrs = {
  name: string;
  value?: string;
  valueFunction?: string;
  format?: string;
};

const DEFAULT_FORMAT = '.1f';

const variable: NodeSpec = {
  // inline: true,
  group: NodeGroups.top,
  content: '',
  attrs: {
    name: {},
    value: { default: '' },
    valueFunction: { default: '' },
    format: { default: DEFAULT_FORMAT },
  },
  toDOM(node) {
    const {
      name, value, valueFunction, format,
    } = node.attrs;
    return ['r-var', {
      name,
      value: value || undefined,
      ':value': valueFunction || undefined,
      format,
    }];
  },
  parseDOM: [{
    tag: 'r-var',
    getAttrs(dom: any): VariableAttrs {
      return {
        name: dom.getAttribute('name') ?? '',
        value: dom.getAttribute('value') ?? '',
        valueFunction: dom.getAttribute(':value') ?? '',
        format: dom.getAttribute('format') ?? DEFAULT_FORMAT,
      };
    },
  }],
};

export default variable;
