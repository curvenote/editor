export const getDoc = (el: HTMLElement | null) => {
  const doc = el?.closest('article')?.id;
  // eslint-disable-next-line no-console
  if (el && !doc) console.warn('Parent doc for comment not found.');
  return doc || 'global';
};
