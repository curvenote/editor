import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Root } from 'mdast';
import { getSchema, UseSchema } from '../../schemas';
import { convertToMdast } from './convertToMdast';
import { NodesAndMarks } from './types';

const replacements: NodesAndMarks = {
  link: (props) => ({ type: 'link', children: [] }),
  blockquote: (props) => ({ type: 'blockquote', children: [] }),
  horizontal_rule: (props) => ({ type: 'thematicBreak' }),
  paragraph: (props) => ({ type: 'paragraph', children: props.children }),
};

export function toMdast(doc: ProsemirrorNode, useSchema: UseSchema): Root {
  const schema = getSchema(useSchema);
  return convertToMdast(doc, schema, replacements);
}
