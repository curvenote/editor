import { types } from '@curvenote/runtime';
import { register as basicRegister } from '@curvenote/components';
import { Store } from './store/types';

export default function setup(store: Store) {
  basicRegister(store as unknown as types.Store);
}
