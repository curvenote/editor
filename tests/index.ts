import { builders } from 'prosemirror-test-builder';
import { EditorState, TextSelection, NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import schema from './schema';
import { Node } from 'prosemirror-model';

const initSelection = (doc: any) => {
  const { cursor, node } = doc.tag;
  if (node) {
    return new NodeSelection(doc.resolve(node));
  }
  if (typeof cursor === 'number') {
    return new TextSelection(doc.resolve(cursor));
  }
};

export const {
  doc,
  p,
  text,
  atomInline,
  atomBlock,
  atomContainer,
  heading,
  blockquote,
  a,
  strong,
  em,
  code,
  code_block,
  hr,
  containerWithRestrictedContent,
} = builders(schema, {
  doc: { nodeType: 'doc' },
  p: { nodeType: 'paragraph' },
  text: { nodeType: 'text' },
  atomInline: { nodeType: 'atomInline' },
  atomBlock: { nodeType: 'atomBlock' },
  atomContainer: { nodeType: 'atomContainer' },
  containerWithRestrictedContent: {
    nodeType: 'containerWithRestrictedContent',
  },
  heading: { nodeType: 'heading' },
  blockquote: { nodeType: 'blockquote' },
  a: { markType: 'link', href: 'foo' },
  strong: { markType: 'strong' },
  em: { markType: 'em' },
  code: { markType: 'code' },
  code_block: { nodeType: 'code_block' },
  hr: { markType: 'rule' },
}) as any;

export function createEditor(doc: Node) {
  const place = document.body.appendChild(document.createElement('div'));
  const state = EditorState.create({
    doc,
    schema,
    selection: initSelection(doc),
  });
  const view = new EditorView(place, { state });

  const clean = () => {
    view.destroy();
    if (place && place.parentNode) {
      place.parentNode.removeChild(place);
    }
  };

  return { state, view, ...(doc as any).tag };
}
