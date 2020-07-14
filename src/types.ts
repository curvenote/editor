export { VariableAttrs } from './nodes/variable';
export { DisplayAttrs } from './nodes/display';
export { DynamicAttrs } from './nodes/dynamic';
export { RangeAttrs } from './nodes/range';

export type Parser = {
  new(): DOMParser;
  prototype: DOMParser;
};
