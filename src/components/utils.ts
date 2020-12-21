export const getDoc = (el: HTMLElement) => {
  const doc = el.closest('article')?.getAttribute('doc');
  // eslint-disable-next-line no-console
  if (!doc) console.warn('Parent doc for comment not found.');
  return doc || 'global';
};
