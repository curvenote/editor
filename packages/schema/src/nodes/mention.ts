import type { MyNodeSpec } from './types';
import { LEGACY_NODE_GROUPS } from './types';
import type { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import type { Mention } from '../spec';

export interface Attrs {
  label: string;
  user: string;
}

const mention: MyNodeSpec<Attrs, Mention> = {
  group: LEGACY_NODE_GROUPS.inline,
  attrs: { label: { default: '' }, user: { default: '' } },
  inline: true,
  draggable: true,
  selectable: true,
  marks: '',
  toDOM(node: any) {
    const { label, user } = node.attrs;
    return ['span', { title: label, 'data-user': user, class: 'mention' }];
  },
  parseDOM: [
    {
      tag: 'span.mention',
      getAttrs(dom: HTMLSpanElement): Attrs {
        const label = dom.getAttribute('title') || '';
        const user = dom.getAttribute('data-user') || '';
        return { label, user };
      },
    },
  ],
  attrsFromMyst: (token) => ({
    user: token.identifier,
    label: token.value || '',
  }),
  toMyst: (props) => ({
    type: 'mention',
    identifier: props['data-user'],
    label: props['data-user'],
    value: props.title,
  }),
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.write(node.attrs.label);
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.write(node.attrs.label);
};

export default mention;
