import { NodeSpec } from 'prosemirror-model';
import { NodeGroups } from './types';

export type DisplayAttrs = {
  value?: string;
  valueFunction?: string;
  format?: string;
};

const display: NodeSpec = {
  inline: true,
  group: NodeGroups.inline,
  attrs: {
    value: { default: '' },
    valueFunction: { default: '' },
    format: { default: '' },
  },
  toDOM(node) {
    const { value, valueFunction, format } = node.attrs;
    return ['r-display', {
      value: value || undefined,
      ':value': valueFunction || undefined,
      format: format || undefined,
    }];
  },
  parseDOM: [{
    tag: 'r-display',
    getAttrs(dom: any): DisplayAttrs {
      return {
        value: dom.getAttribute('value') ?? '',
        valueFunction: dom.getAttribute(':value') ?? '',
        format: dom.getAttribute('format') ?? '',
      };
    },
  }],
};

export default display;
