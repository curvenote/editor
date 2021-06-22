import { v4 as uuid } from 'uuid';

export function createId(prepend = '') {
  const id = uuid().split('-')[0];
  if (!prepend) {
    // ensure the id starts with a letter
    return `a${id.slice(1)}`;
  }
  return `${prepend}-${id}`;
}
