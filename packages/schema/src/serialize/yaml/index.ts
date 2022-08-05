import yaml from 'js-yaml';
import type { Node as ProsemirrorNode } from 'prosemirror-model';

export function toYAML(doc: ProsemirrorNode): string {
  return yaml.dump(doc.toJSON());
}
