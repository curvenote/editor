import { MyNodeSpec, NodeGroups } from './types';
import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';

export interface Attrs {
  label: string;
  user: string;
}

export type MentionMystNode = {
  type: 'mention';
  identifier: string;
  label?: string;
  value: string;
};

function createMentionNodeSpecs() {
  const mentionNodeSpec: MyNodeSpec<Attrs, MentionMystNode> = {
    group: NodeGroups.inline,
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
    attrsFromMdastToken: (token) => ({
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
  return {
    mention: mentionNodeSpec,
  };
}

const mention = createMentionNodeSpecs();

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.write(node.attrs.label);
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.write(node.attrs.label);
};

export default mention;
