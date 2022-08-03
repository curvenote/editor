import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { getSchema, UseSchema } from '../../schemas';

export function fromJSON(
  content: string | Record<string, any>,
  useSchema: UseSchema,
): ProsemirrorNode {
  const schema = getSchema(useSchema);
  const data = typeof content === 'string' ? JSON.parse(content) : content;
  const state = EditorState.fromJSON(
    { schema },
    { doc: data, selection: { type: 'text', anchor: 0, head: 0 } },
  );
  return state.doc;
}
