/* eslint-disable no-underscore-dangle */
import { Theme } from '@material-ui/core';
import * as sidenotes from 'sidenotes';
import { EditorState, Transaction } from 'prosemirror-state';
import { Fragment, Node, Schema, Slice } from 'prosemirror-model';
import { DirectEditorProps, EditorView } from 'prosemirror-view';
import { Nodes } from '@curvenote/schema';
import { Store } from './store/types';
import setupComponents from './r-components';
import { LinkResult } from './store/suggestion/types';

export type SearchContext = {
  search: (query?: string) => LinkResult[];
};

export interface UploadImageState {
  url: string;
  caption: string;
}

export type Options = {
  transformKeyToId: (key: any) => string | null;
  handlePaste?: (view: EditorView, event: ClipboardEvent, slice: Slice) => boolean;
  uploadImage: (file: File, node: Node | null) => Promise<UploadImageState | null>;
  modifyTransaction?: (
    stateKey: any,
    viewId: string,
    state: EditorState,
    transaction: Transaction,
  ) => Transaction;
  // This is used in the comments plugin to know which doc to refer to.
  // Should be the current selected doc.
  getDocId: () => string;
  addComment?: (stateKey: any, state: EditorState) => boolean;
  onDoubleClick?: (
    stateKey: any,
    viewId: string | null,
    view: EditorView<any>,
    pos: number,
    event: MouseEvent,
  ) => boolean;
  theme: Theme;
  citationPrompt: () => Promise<Nodes.Cite.Attrs[] | null>;
  createLinkSearch: () => Promise<SearchContext>;
  throttle: number;
  // nodeViews override any of the default nodeviews
  nodeViews?: DirectEditorProps['nodeViews'];
  getCaptionFragment?: (schema: Schema, src: string) => Fragment;
};

type Ref<T> = {
  store: () => T;
  _store?: T;
  opts: () => Options;
  _opts?: Options;
};

export const ref: Ref<Store> = {
  store() {
    if (ref._store === undefined) throw new Error('Must init store.');
    return ref._store;
  },
  opts() {
    if (ref._opts === undefined) throw new Error('Must init opts.');
    return ref._opts;
  },
};

export function setup(store: Store, opts: Options) {
  ref._store = store;
  ref._opts = opts;
  setupComponents(store);
  sidenotes.setup((store as unknown) as sidenotes.Store, { padding: 10 });
}

export const store: Pick<Store, 'getState' | 'dispatch'> = {
  getState: () => ref.store().getState(),
  dispatch: (action: any) => ref.store().dispatch(action),
};

export const opts: Required<Options> = {
  transformKeyToId: (key: any) => ref.opts().transformKeyToId(key),
  uploadImage(file: File, node: Node | null) {
    return ref.opts().uploadImage(file, node);
  },
  handlePaste(view: EditorView, event: ClipboardEvent, slice: Slice) {
    return ref.opts().handlePaste?.(view, event, slice) ?? false;
  },
  modifyTransaction(stateKey: any, viewId: string, state: EditorState, transaction: Transaction) {
    const { modifyTransaction } = ref.opts();
    if (modifyTransaction) {
      return modifyTransaction(stateKey, viewId, state, transaction);
    }
    return transaction;
  },
  addComment(stateKey: any, state: EditorState) {
    return ref.opts().addComment?.(stateKey, state) ?? false;
  },
  onDoubleClick(stateId, viewId, view, pos, event) {
    return ref.opts().onDoubleClick?.(stateId, viewId, view, pos, event) ?? false;
  },
  getDocId() {
    return ref.opts().getDocId();
  },
  citationPrompt() {
    return ref.opts().citationPrompt();
  },
  createLinkSearch() {
    return ref.opts().createLinkSearch();
  },
  getCaptionFragment(schema, src) {
    return ref.opts().getCaptionFragment?.(schema, src) ?? Fragment.empty;
  },
  get theme() {
    return ref.opts().theme;
  },
  get throttle() {
    return ref.opts().throttle;
  },
  get nodeViews() {
    return ref.opts().nodeViews ?? {};
  },
};
