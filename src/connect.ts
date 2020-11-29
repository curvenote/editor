/* eslint-disable no-underscore-dangle */
import { Theme } from '@material-ui/core';
import { Store } from './store/types';

export type Options = {
  transformKeyToId: (key: any) => string;
  image: {
    upload: (file: File) => Promise<string | null>;
    downloadUrl: (src: string) => Promise<string>;
  };
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
}

export const store: Pick<Store, 'getState' | 'dispatch'> = {
  getState: () => ref.store().getState(),
  dispatch: (action: any) => ref.store().dispatch(action),
};

export const opts: Options = {
  transformKeyToId: (key: any) => ref.opts().transformKeyToId(key),
  get image() {
    return {
      upload: (file: File) => ref.opts().image.upload(file),
      downloadUrl: (src: string) => ref.opts().image.downloadUrl(src),
    };
  },
  get theme() { return ref.opts().theme; },
  get throttle() { return ref.opts().throttle; },
};
