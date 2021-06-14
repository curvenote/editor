export type ActionProps = {
  stateId: any;
  viewId: string | null;
  anchorEl: HTMLElement | Element | null | undefined;
};

export function positionPopper(anchorEl?: HTMLElement | Element | null) {
  if (anchorEl?.isConnected || anchorEl == null) {
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
  }
}
