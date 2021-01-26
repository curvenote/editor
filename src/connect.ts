/* eslint-disable no-underscore-dangle */
import { Theme } from '@material-ui/core';
import { setup as setupComments, Store as CommentsStore } from '@curvenote/comments';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Store } from './store/types';
import setupComponents from './components';

export type Options = {
  transformKeyToId: (key: any) => string | null;
  image: {
    upload: (file: File) => Promise<string | null>;
    downloadUrl: (src: string) => Promise<string>;
  };
  modifyTransaction?: (
    stateKey: any, viewId: string, state: EditorState, transaction: Transaction
  ) => Transaction;
  // This is used in the comments plugin to know which doc to refer to.
  // Should be the current selected doc.
  getDocId: () => string;
  addComment?: (stateKey: any, state: EditorState) => boolean;
  onDoubleClick?: (
    stateKey: any, viewId: string | null, view: EditorView<any>, pos: number, event: MouseEvent,
  ) => boolean;
  theme: Theme;
  throttle: number;
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
  setupComments(store as unknown as CommentsStore, { padding: 10 });
}

export const store: Pick<Store, 'getState' | 'dispatch'> = {
  getState: () => ref.store().getState(),
  dispatch: (action: any) => ref.store().dispatch(action),
};

export const opts: Required<Options> = {
  transformKeyToId: (key: any) => ref.opts().transformKeyToId(key),
  get image() {
    return {
      upload: (file: File) => ref.opts().image.upload(file),
      downloadUrl: (src: string) => ref.opts().image.downloadUrl(src),
    };
  },
  modifyTransaction(
    stateKey: any, viewId: string, state: EditorState, transaction: Transaction,
  ) {
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
  getDocId() { return ref.opts().getDocId(); },
  get theme() { return ref.opts().theme; },
  get throttle() { return ref.opts().throttle; },
};
