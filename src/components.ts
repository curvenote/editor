import { types } from '@iooxa/runtime';
import { register as articleRegister } from '@iooxa/article';
import { register as basicRegister } from '@iooxa/components';
import { Store } from './store/types';

export default function setup(store: Store) {
  basicRegister(store as unknown as types.Store);
  articleRegister(store as unknown as types.Store);
}
