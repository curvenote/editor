import { Admonition, FlowContent } from 'myst-spec';
import { MdFormatSerialize } from '../serialize/types';
import { createLatexStatement } from '../serialize/tex/utils';
import { MyNodeSpec, NodeGroups } from './types';

export enum CalloutKinds {
  'active' = 'active',
  'success' = 'success',
  'info' = 'info',
  'warning' = 'warning',
  'danger' = 'danger',
}

export enum AdmonitionKinds {
  'attention' = 'attention',
  'caution' = 'caution',
  'danger' = 'danger',
  'error' = 'error',
  'hint' = 'hint',
  'important' = 'important',
  'note' = 'note',
  'seealso' = 'seealso',
  'tip' = 'tip',
  'warning' = 'warning',
}

export function calloutKindToAdmonition(kind: CalloutKinds): string {
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

export type Attrs = {
  kind: CalloutKinds;
};

export function admonitionToCalloutKind(kind?: string): CalloutKinds {
  switch (kind) {
    case 'danger':
    case 'error':
      return CalloutKinds.danger;
    case 'warning':
      return CalloutKinds.warning;
    case 'note':
      return CalloutKinds.active;
    case 'important':
      return CalloutKinds.success;
    default:
      return CalloutKinds.info;
  }
}

const callout: MyNodeSpec<Attrs, Admonition> = {
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
  attrsFromMdastToken: (token) => ({
    kind: admonitionToCalloutKind(token.kind),
  }),
  toMyst: (props): Admonition => {
    let calloutKind = props.class.split(' ')[1];
    if (!Object.values(AdmonitionKinds).includes(calloutKind as AdmonitionKinds)) {
      calloutKind = calloutKindToAdmonition(calloutKind as CalloutKinds);
    }
    return {
      type: 'admonition',
      kind: calloutKind,
      children: (props.children || []) as FlowContent[],
    };
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  state.ensureNewLine();
  const { kind } = node.attrs as Attrs;
  const admonition = calloutKindToAdmonition(kind);
  // This is a bit of a hack, callouts often have other directives
  state.write(`\`\`\`\`{${admonition}}`);
  state.ensureNewLine();
  state.renderContent(node);
  state.write('````');
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
