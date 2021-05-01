import * as runtime from '@curvenote/runtime';
import * as collab from './collab';

export * from './store';

export { default as Editor } from './components/Editor';
export { default as EditorMenu } from './components/Menu';
export { default as Suggestion } from './components/Suggestion';
export { default as Attributes } from './components/Attributes';

export { default as views } from './views';

export { setup, opts } from './connect';
export type { Options } from './connect';
export { runtime, collab };

export { isEditable, setEditable } from './prosemirror/plugins/editable';
