export const LINK_TYPES = ['link', 'link-block'] as const;
export type LinkType = typeof LINK_TYPES[number];
