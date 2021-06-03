import { LinkAttrs } from './marks';

export type Parser = {
  new(): DOMParser;
  prototype: DOMParser;
};

export type { LinkAttrs };
