/* eslint-disable no-underscore-dangle */
import { Store } from './store/types';

type Ref<T> = { current: () => T; _current?: T };

const storeRef: Ref<Store> = {
  current() {
    if (storeRef._current === undefined) throw new Error('Must init store.');
    return storeRef._current;
  },
};

export function setup(store: Store) {
  storeRef._current = store;
}

const store: Pick<Store, 'getState' | 'dispatch'> = {
  getState: () => storeRef.current().getState(),
  dispatch: (action: any) => storeRef.current().dispatch(action),
};

export default store;
