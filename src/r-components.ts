import { types } from '@curvenote/runtime';
import { register as basicRegister } from '@curvenote/components';
import { Store } from './store/types';

// acutally stamps WebComponents on to a global variable, if we don't guard the registeration we will need to deregister
// TODO: instance editor properly...
let isSetup = false;
export default function setup(store: Store) {
  if (isSetup) return;
  basicRegister(store as unknown as types.Store);
  isSetup = true;
}
