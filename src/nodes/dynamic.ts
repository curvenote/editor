import { NodeSpec } from 'prosemirror-model';
import { NodeGroups } from './types';

export type DynamicAttrs = {
  value?: string;
  valueFunction?: string;
  changeFunction?: string;
  format?: string;
  min?: string;
  minFunction?: string;
  max?: string;
  maxFunction?: string;
  step?: string;
  stepFunction?: string;
};

const dynamic: NodeSpec = {
  inline: true,
  group: NodeGroups.inline,
  attrs: {
    value: { default: '' },
    valueFunction: { default: '' },
    changeFunction: { default: '' },
    format: { default: '.1f' },
    min: { default: '0' },
    minFunction: { default: '' },
    max: { default: '100' },
    maxFunction: { default: '' },
    step: { default: '1' },
    stepFunction: { default: '' },
  },
  toDOM(node) {
    const {
      value, valueFunction, changeFunction, format,
      min, minFunction, max, maxFunction, step, stepFunction,
    } = node.attrs;
    return ['r-dynamic', {
      value: value || undefined,
      ':value': valueFunction || undefined,
      ':change': changeFunction || undefined,
      format: format || undefined,
      min: min || undefined,
      ':min': minFunction || undefined,
      max: max || undefined,
      ':max': maxFunction || undefined,
      step: step || undefined,
      ':step': stepFunction || undefined,
    }];
  },
  parseDOM: [{
    tag: 'r-dynamic',
    getAttrs(dom: any): DynamicAttrs {
      return {
        value: dom.getAttribute('value') ?? '',
        valueFunction: dom.getAttribute(':value') ?? '',
        changeFunction: dom.getAttribute(':change') ?? '',
        format: dom.getAttribute('format') ?? '',
        min: dom.getAttribute('min') ?? '',
        minFunction: dom.getAttribute(':min') ?? '',
        max: dom.getAttribute('max') ?? '',
        maxFunction: dom.getAttribute(':max') ?? '',
        step: dom.getAttribute('step') ?? '',
        stepFunction: dom.getAttribute(':step') ?? '',
      };
    },
  }],
};

export default dynamic;
