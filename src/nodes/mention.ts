import { MyNodeSpec, NodeGroups } from './types';
import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';

export interface MentionNodeAttrState {
  label: string;
  user: string; // Things not from suggestion will not have this
}

export function createMentionNodeSpecs() {
  const mentionNodeSpec: MyNodeSpec<MentionNodeAttrState> = {
    group: NodeGroups.inline,
    attrs: { label: { default: '' }, user: { default: '' } },
    inline: true,
    atom: true,
    draggable: true,
    selectable: true,
    toDOM(node: any) {
      const { label, user } = node.attrs;
      return ['span', { title: label, 'data-user': user, class: 'mention' }];
    },
    parseDOM: [
      {
        tag: 'span.mention',
        getAttrs(dom: HTMLSpanElement): MentionNodeAttrState {
          const label = dom.getAttribute('title') || '';
          const user = dom.getAttribute('data-user') || '';
          return { label, user };
        },
      },
    ],
  };
  return {
    mention: mentionNodeSpec,
  };
}

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.write(node.attrs.label);
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.write(node.attrs.label);
};
