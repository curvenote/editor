import { NodeSpec } from 'prosemirror-model';
import { MdFormatSerialize } from '../serialize/types';
import { createLatexStatement } from '../serialize/tex/utils';
import { NodeGroups } from './types';

export enum CalloutKinds {
  'active' = 'active',
  'success' = 'success',
  'info' = 'info',
  'warning' = 'warning',
  'danger' = 'danger',
}

export type Attrs = {
  kind: CalloutKinds;
};

const callout: NodeSpec = {
  group: NodeGroups.top,
  content: NodeGroups.blockOrEquationOrHeading,
  attrs: {
    kind: { default: CalloutKinds.info },
  },
  toDOM(node) {
    return ['aside', { class: `callout ${node.attrs.kind}` }, 0];
  },
  parseDOM: [
    {
      tag: 'aside.callout',
      getAttrs(dom: any) {
        if (dom.classList.contains(CalloutKinds.active)) return { kind: CalloutKinds.active };
        if (dom.classList.contains(CalloutKinds.success)) return { kind: CalloutKinds.success };
        if (dom.classList.contains(CalloutKinds.info)) return { kind: CalloutKinds.info };
        if (dom.classList.contains(CalloutKinds.warning)) return { kind: CalloutKinds.warning };
        if (dom.classList.contains(CalloutKinds.danger)) return { kind: CalloutKinds.danger };
        return { kind: CalloutKinds.info };
      },
      // aside is also parsed, and this is higher priority
      priority: 60,
    },
  ],
};

function calloutKindToAdmonition(kind: CalloutKinds): string {
  // https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html#directives
  // attention, caution, danger, error, hint, important, note, tip, warning
  switch (kind) {
    case CalloutKinds.active:
      return 'note';
    case CalloutKinds.success:
      return 'important';
    case CalloutKinds.info:
      return 'important';
    case CalloutKinds.warning:
      return 'warning';
    case CalloutKinds.danger:
      return 'danger';
    default:
      return 'note';
  }
}

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.ensureNewLine();
  const { kind } = node.attrs as Attrs;
  const admonition = calloutKindToAdmonition(kind);
  state.write(`\`\`\`{${admonition}}`);
  state.ensureNewLine();
  state.renderContent(node);
  state.write('```');
  state.closeBlock(node);
};

export const toTex = createLatexStatement(
  () => ({
    command: 'callout',
  }),
  (state, node) => {
    state.renderContent(node);
  },
);

export default callout;
