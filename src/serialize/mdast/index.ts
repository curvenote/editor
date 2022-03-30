import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Root } from 'mdast';
import { getSchema, UseSchema } from '../../schemas';
import { convertToMdast, normalizeLabel } from './convertToMdast';
import { NodesAndMarks } from './types';
import { CalloutKinds, calloutKindToAdmonition } from '../../nodes/callout';
import { formatDatetime } from '../../nodes/time';

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

const replacements: NodesAndMarks = {
  link: (props) => ({
    type: 'link',
    url: props.href,
    title: props.title || undefined,
    children: props.children,
  }),
  blockquote: (props) => ({ type: 'blockquote', children: props.children }),
  horizontal_rule: () => ({ type: 'thematicBreak' }),
  paragraph: (props) => ({ type: 'paragraph', children: props.children }),
  hard_break: () => ({ type: 'break' }),
  heading: (props) => ({
    type: 'heading',
    depth: parseInt(props.tag.slice(1), 10),
    children: props.children,
  }),
  em: (props) => ({ type: 'emphasis', children: props.children }),
  strong: (props) => ({ type: 'strong', children: props.children }),
  subscript: (props) => ({ type: 'subscript', children: props.children }),
  superscript: (props) => ({ type: 'superscript', children: props.children }),
  code: (props) => {
    if (props.children?.length === 1 && props.children[0].type === 'text') {
      return { type: 'inlineCode', value: props.children[0].value };
    }
    throw new Error(`Code node does not have one child`);
  },
  code_block: (props) => {
    if (props.children?.length === 1) {
      return {
        type: 'code',
        lang: props.language || undefined,
        showLineNumbers: props.linenumbers || undefined,
        value: props.children[0].value,
      };
    }
    throw new Error(`Code block node does not have one child`);
  },
  abbr: (props) => {
    return { type: 'abbreviation', title: props.title || undefined, children: props.children };
  },
  math: (props) => {
    if (props.children?.length === 1 && props.children[0].type === 'text') {
      return { type: 'inlineMath', value: props.children[0].value };
    }
    throw new Error(`Code node does not have one child`);
  },
  equation: (props) => {
    if (props.children?.length === 1 && props.children[0].type === 'text') {
      return {
        type: 'math',
        ...normalizeLabel(props.id),
        value: props.children[0].value,
      };
    }
    throw new Error(`Equation node does not have one child`);
  },
  list_item: (props) => {
    if (props.children?.length === 1 && props.children[0].type === 'paragraph') {
      return {
        type: 'listItem',
        children: props.children[0].children,
      };
    }
    return {
      type: 'listItem',
      children: props.children,
    };
  },
  bullet_list: (props) => ({ type: 'list', ordered: false, children: props.children }),
  ordered_list: (props) => ({
    type: 'list',
    ordered: true,
    start: props.start || undefined,
    children: props.children,
  }),
  image: (props) => ({
    type: 'image',
    url: props.src,
    alt: props.alt || undefined,
    title: props.title || undefined,
    align: undefined,
    width: props.width || undefined,
  }),
  figcaption: (props) => ({ type: 'caption', children: props.children }),
  figure: (props) => {
    let containerKind = 'figure';
    if (props.align) {
      props.children?.forEach((child) => {
        if (child.type === 'image' || child.type === 'table') {
          child.align = props.align;
        }
        if (child.type === 'table') {
          containerKind = 'table';
        }
      });
    }
    return {
      type: 'container',
      kind: containerKind,
      ...normalizeLabel(props.id),
      numbered: props.numbered,
      class: props.align ? `align-${props.align}` : undefined,
      children: props.children,
    };
  },
  time: (props) => ({ type: 'text', value: formatDatetime(props.datetime).f }),
  callout: (props) => {
    let calloutKind = props.class.split(' ')[1];
    if (!Object.values(AdmonitionKinds).includes(calloutKind as AdmonitionKinds)) {
      calloutKind = calloutKindToAdmonition(calloutKind as CalloutKinds);
    }
    return {
      type: 'admonition',
      kind: calloutKind,
      children: props.children,
    };
  },
  table_row: (props) => ({ type: 'tableRow', children: props.children }),
  table_header: (props) => ({
    type: 'tableCell',
    header: true,
    align: undefined,
    children: props.children,
  }),
  table_cell: (props) => ({
    type: 'tableCell',
    header: undefined,
    align: undefined,
    children: props.children,
  }),
  table: (props) => {
    if (props.children?.length === 1 && props.children[0].type === 'table') {
      return props.children[0];
    }
    return { type: 'table', align: undefined, children: props.children };
  },
};

export function toMdast(doc: ProsemirrorNode, useSchema: UseSchema): Root {
  const schema = getSchema(useSchema);
  return convertToMdast(doc, schema, replacements);
}
