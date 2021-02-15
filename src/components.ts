import { types } from '@curvenote/runtime';
import { register as articleRegister } from '@curvenote/article';
import { register as basicRegister } from '@curvenote/components';
import { Store } from './store/types';

export default function setup(store: Store) {
  basicRegister(store as unknown as types.Store);
  articleRegister(store as unknown as types.Store);
}
