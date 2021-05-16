import { v4 as uuid } from 'uuid';

export type ActionProps = {
  stateId: any;
  viewId: string | null;
  anchorEl: HTMLElement | Element | null | undefined;
};

export function positionPopper(anchorEl: HTMLElement | Element | null | undefined) {
  if (anchorEl?.isConnected) { window.scrollBy(0, 1); window.scrollBy(0, -1); }
}

export const newLabel = (prepend: string) => `${prepend}-${uuid().split('-')[0]}`;
