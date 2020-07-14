import { NodeSpec } from 'prosemirror-model';
import { NodeGroups } from './types';

export type VariableAttrs = {
  name: string;
  value?: string;
  valueFunction?: string;
  format?: string;
};

const variable: NodeSpec = {
  // inline: true,
  group: NodeGroups.top,
  content: '',
  attrs: {
    name: {},
    value: { default: '0' },
    valueFunction: { default: '' },
    format: { default: '.1f' },
  },
  toDOM(node) {
    const {
      name, value, valueFunction, format,
    } = node.attrs;
    return ['r-var', {
      name, value, ':value': valueFunction, format,
    }];
  },
  parseDOM: [{
    tag: 'r-var',
    getAttrs(dom: any): VariableAttrs {
      return {
        name: dom.getAttribute('name'),
        value: dom.getAttribute('value'),
        valueFunction: dom.getAttribute(':value'),
        format: dom.getAttribute('format'),
      };
    },
  }],
};

export default variable;
