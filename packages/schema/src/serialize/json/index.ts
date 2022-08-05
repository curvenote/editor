import type { Node as ProsemirrorNode } from 'prosemirror-model';

export function toJSON(doc: ProsemirrorNode): string {
  return JSON.stringify(doc.toJSON());
}
