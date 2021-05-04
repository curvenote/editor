// Note: Sometimes you need to ensure that the libs are exactly the same
//       Exporting the `prosemirror-model` schema from here does the trick.
export { Schema } from 'prosemirror-model';
export * as schemas from './schemas';
export * as Nodes from './nodes';

export {
  fromHTML,
  migrateHTML,
  fromText,
  fromMarkdown,
} from './parse';
export {
  toHTML,
  toMarkdown,
  toTex,
  toText,
} from './serialize';

export * as server from './server';

export { DEFAULT_FORMAT, DEFAULT_IMAGE_WIDTH } from './utils';
