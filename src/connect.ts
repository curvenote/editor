/* eslint-disable no-underscore-dangle */
import { Theme } from '@material-ui/core';
import { EditorState, Transaction } from 'prosemirror-state';
import { Store } from './store/types';
import setupComponents from './components';

export type Options = {
  transformKeyToId: (key: any) => string;
  image: {
    upload: (file: File) => Promise<string | null>;
    downloadUrl: (src: string) => Promise<string>;
  };
  modifyTransaction?: (
    stateKey: any, viewId: string, state: EditorState, transaction: Transaction
  ) => Transaction;
  theme: Theme;
  throttle: number;
};

type Ref<T> = {
  store: () => T;
  _store?: T;
  opts: () => Options;
  _opts?: Options;
};

const ref: Ref<Store> = {
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
  get theme() { return ref.opts().theme; },
  get throttle() { return ref.opts().throttle; },
};
