import { nanoid } from 'nanoid';

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function createId() {
  return nanoid(10);
}
