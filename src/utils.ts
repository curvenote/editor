function isScrollable(ele: Element) {
  const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

  const overflowYStyle = window.getComputedStyle(ele).overflowY;
  const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

  return hasScrollableContent && !isOverflowHidden;
}

export function getScrollParent(ele?: Element | null): Element | undefined {
  if (!ele || ele === document.body) {
    return document.body;
  }
  if (isScrollable(ele)) {
    return ele;
  }
  return getScrollParent(ele.parentElement as Element | undefined);
}
