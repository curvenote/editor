import * as runtime from '@curvenote/runtime';
import * as collab from './collab';

export * from './store';
export * from './components';

export { default as views } from './views';
export type { NodeViewProps } from './views';

export { setup, opts, store } from './connect';
export type { Options } from './connect';
export { runtime, collab };

export { isEditable, setEditable } from './prosemirror/plugins/editable';
export { createEditorState } from './prosemirror';
