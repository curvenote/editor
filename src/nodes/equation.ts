import { NodeGroups, MyNodeSpec, NumberedNode } from './types';
import { Math } from '../spec';
import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import {
  getAttr,
  getNumberedAttrs,
  getNumberedDefaultAttrs,
  normalizeLabel,
  readBooleanAttr,
  setNumberedAttrs,
} from './utils';
import { writeDirectiveOptions } from '../serialize/markdown/utils';

export type Attrs = NumberedNode & {
  title: string;
};

const DEFAULT_NUMBERED = false;

const equation: MyNodeSpec<Attrs, Math> = {
  group: NodeGroups.top,
  // Content can have display elements inside of it for dynamic equations
  content: `(${NodeGroups.text} | display)*`,
  draggable: false,
  // The view treat the node as a leaf, even though it technically has content
  atom: true,
  code: true,
  attrs: {
    ...getNumberedDefaultAttrs(),
    title: { default: '' },
  },
  toDOM: (node) => {
    const { title } = node.attrs;
    return ['r-equation', { ...setNumberedAttrs(node.attrs), title: title || undefined }, 0];
  },
  parseDOM: [
    {
      tag: 'r-equation:not([inline])',
      getAttrs(dom) {
        return {
          ...getNumberedAttrs(dom),
          title: getAttr(dom, 'title'),
        };
      },
    },
  ],
  attrsFromMyst: (token) => ({
    id: token.identifier || null,
    label: null,
    numbered: token.numbered ?? DEFAULT_NUMBERED,
    title: '',
  }),
  toMyst: (props, options) => {
    if (props.children?.length === 1 && props.children[0].type === 'text') {
      const localizedId = options.localizeId?.(props.id ?? '') ?? props.id ?? '';
      return {
        type: 'math',
        ...normalizeLabel(localizedId),
        numbered: readBooleanAttr(props.numbered),
        value: props.children[0].value || '',
      };
    }
    throw new Error(`Equation node does not have one child`);
  },
};

export const equationNoDisplay: MyNodeSpec<Attrs, Math> = {
  ...equation,
  content: `${NodeGroups.text}*`,
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  const { numbered, id } = node.attrs;
  const localId = state.options.localizeId?.(id ?? '') ?? id;
  // TODO: this should be more specific, see amsmath
  const amsBegin = node.textContent.startsWith('\\begin{');
  const amsEnd = node.textContent.match(/\\end{([a-z*]+)}$/);
  const ams = amsBegin && amsEnd;
  if (ams) {
    state.text(node.textContent, false);
  } else if (numbered) {
    state.write('```{math}\n');
    writeDirectiveOptions(state, { label: localId });
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('```');
  } else if (node.textContent.includes('\n')) {
    // New lines in the $$
    state.write('$$\n');
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('$$');
  } else {
    state.write('$$');
    state.text(node.textContent, false);
    state.write('$$');
  }
  state.closeBlock(node);
};

export const toTex: TexFormatSerialize = (state, node) => {
  const { numbered, id } = node.attrs;
  const localId = state.options.localizeId?.(id ?? '') ?? id;
  const text = node.textContent.trim();
  const amsBegin = text.startsWith('\\begin{');
  const amsEnd = text.match(/\\end{([a-z*]+)}$/);
  const ams = amsBegin && amsEnd;
  if (state.isInTable) {
    // NOTE: if this is also AMS, this will likely fail.
    state.write('\\(\\displaystyle ');
    state.renderInline(node);
    state.write(' \\)');
  } else if (ams) {
    state.renderInline(node);
  } else {
    state.write('\\begin{equation}\n');
    if (numbered && id) {
      state.write(`\\label{${localId}}`);
    }
    state.ensureNewLine();
    state.renderInline(node);
    state.ensureNewLine();
    state.write('\\end{equation}');
  }
  if (!state.isInTable) state.closeBlock(node);
};

export default equation;
