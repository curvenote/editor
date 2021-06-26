/* eslint-disable no-underscore-dangle */
import { Unsubscribe } from 'redux';
import { v4 as uuid } from 'uuid';
import { State, Store } from './store/types';

export type Options = {
  padding?: number;
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

const subscriptions: { [index: string]: { listener: () => void } } = {};

function subscribe(listener: () => void): Unsubscribe {
  const key = uuid();
  subscriptions[key] = { listener };
  return () => delete subscriptions[key];
}

let currentState: State['sidenotes'];
function notify(store: Store) {
  const previousState = currentState;
  currentState = store.getState().sidenotes;
  if (previousState === currentState) return;
  Object.keys(subscriptions).forEach((key: string) => {
    const { listener } = subscriptions[key];
    listener();
  });
}

export function setup(store: Store, opts: Options) {
  ref._store = store;
  ref._opts = opts;
  store.subscribe(() => notify(store));
}

export const store: Pick<Store, 'getState' | 'dispatch' | 'subscribe'> = {
  getState: () => ref.store().getState(),
  dispatch: (action: any) => ref.store().dispatch(action),
  subscribe: (listener: () => void): Unsubscribe => subscribe(listener),
};

export const opts: Required<Options> = {
  get padding() {
    return ref.opts().padding ?? 10;
  },
};
