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
      return ['span', { label, user, class: 'mention' }];
    },
    parseDOM: [
      {
        tag: 'span.mention',
        getAttrs(dom: HTMLSpanElement): MentionNodeAttrState {
          const label = (dom as HTMLSpanElement).getAttribute('label') || '';
          const user = (dom as HTMLSpanElement).getAttribute('user') || '';
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
  state.write('mention node to markdown not supported');
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.write('mention node to tex not supported');
};
