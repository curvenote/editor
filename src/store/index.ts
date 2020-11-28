import * as actions from './prosemirror/actions';
import * as selectors from './prosemirror/selectors';
import reducer from './prosemirror/reducers';

export { default as middleware } from './prosemirror/middleware';
export * from './types';
export * from './prosemirror/types';

export { reducer, actions, selectors };
