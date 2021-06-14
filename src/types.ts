import { LinkAttrs } from './marks';
import { AlignOptions } from './nodes/types';

export type Parser = {
  new(): DOMParser;
  prototype: DOMParser;
};

export type {
  LinkAttrs,
  AlignOptions,
};
