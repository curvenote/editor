import { Node as ProsemirrorNode } from 'prosemirror-model';
import yaml from 'js-yaml';
import { UseSchema } from '../../schemas';
import { fromJSON } from '../json';

export function fromYAML(input: string, useSchema: UseSchema): ProsemirrorNode {
  return fromJSON(JSON.stringify(yaml.load(input)), useSchema);
}
