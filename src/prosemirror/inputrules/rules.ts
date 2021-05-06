/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InputRule, wrappingInputRule, textblockTypeInputRule,
  smartQuotes,
} from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { insertNodeRule, markInputRule, replaceNodeRule } from './utils';
import { TEST_LINK_COMMON_SPACE, TEST_LINK_SPACE } from '../../store/actions/utils';

export const quotes = (schema: Schema) => smartQuotes;
export const ellipsis = (schema: Schema) => [new InputRule(/\.\.\.$/, '…')];

export const blockquote = (schema: Schema) => [wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote)];

export const arrows = (schema: Schema) => [
  new InputRule(/<--?>\s$/, '↔ '),
  new InputRule(/<==?>\s$/, '⇔ '),
  new InputRule(/-?->\s$/, '→ '),
  new InputRule(/=?=>\s$/, '⇒ '),
  new InputRule(/<--?\s$/, '← '),
  new InputRule(/<==?\s$/, '⇐ '),
  new InputRule(/>>\s$/, '» '),
  new InputRule(/<<\s$/, '« '),
];

export const emojis = (schema: Schema) => [
  new InputRule(/(?:^|\s)<3\s$/, '❤️ '),
  new InputRule(/(?:^|\s)<\/3\s$/, '💔 '),
  new InputRule(/(?:^|\s)\+1\s$/, '👍 '),
];

export const fractions = (schema: Schema) => [
  new InputRule(/1\/2$/, '½'),
  new InputRule(/1\/3$/, '⅓'),
  new InputRule(/2\/3$/, '⅔'),
  new InputRule(/1\/4$/, '¼'),
  new InputRule(/1\/5$/, '⅕'),
  new InputRule(/2\/5$/, '⅖'),
  new InputRule(/3\/5$/, '⅗'),
  new InputRule(/4\/5$/, '⅘'),
  new InputRule(/1\/6$/, '⅙'),
  new InputRule(/5\/6$/, '⅚'),
  new InputRule(/1\/7$/, '⅐'),
  new InputRule(/1\/8$/, '⅛'),
  new InputRule(/3\/8$/, '⅜'),
  new InputRule(/5\/8$/, '⅝'),
  new InputRule(/7\/8$/, '⅞'),
  new InputRule(/1\/9$/, '⅑'),
  new InputRule(/1\/10$/, '⅒'),
];

export const emdash = (schema: Schema) => [
  new InputRule(/--\s$/, '— '),
];

export const copyright = (schema: Schema) => [
  new InputRule(/\s?\(c\)\s$/, ' © '),
  new InputRule(/\s?\(r\)\s$/, ' ® '),
];

export const link = (schema: Schema) => [
  markInputRule(
    TEST_LINK_SPACE,
    schema.marks.link,
    {
      getAttrs: (match: string[]) => ({ href: match[0].slice(0, -1) }),
      addSpace: true,
    },
  ),
  markInputRule(
    TEST_LINK_COMMON_SPACE,
    schema.marks.link,
    {
      getAttrs: (match: string[]) => ({ href: match[0].slice(0, -1) }),
      addSpace: true,
    },
  ),
];

export const lists = (schema: Schema) => [
  wrappingInputRule(
    /^\s*(\d+)\.\s$/,
    schema.nodes.ordered_list,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order === +match[1],
  ),
  wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bullet_list),
];

export const codeBlock = (schema: Schema) => [
  textblockTypeInputRule(/^```$/, schema.nodes.code_block),
];

// TODO: Should have a look ahead as well
// TODO: Should improve the quotes piece as well here
export const codeInline = (schema: Schema) => [
  markInputRule(/`([\W\w]+)`$/, schema.marks.code),
];

export const strong = (schema: Schema) => [
  markInputRule(/\*\*([\W\w]+)\*\*$/, schema.marks.strong),
  markInputRule(/__([\W\w]+)__$/, schema.marks.strong),
];

export const strikethrough = (schema: Schema) => [
  markInputRule(/~([\W\w]+)~$/, schema.marks.strikethrough),
];

export const em = (schema: Schema) => [
  markInputRule(/(\s|^)\*(?!\*)([\W\w]+)\*$/, schema.marks.em, {
    getText: (match) => (match[1] ? ` ${match[2]}` : match[2]),
  }),
  markInputRule(/(\s|^)_(?!_)([\W\w]+)_$/, schema.marks.em, {
    getText: (match) => (match[1] ? ` ${match[2]}` : match[2]),
  }),
];

export const headings = (schema: Schema, maxLevel = 6) => [
  textblockTypeInputRule(
    new RegExp(`^(#{1,${maxLevel}})\\s$`),
    schema.nodes.heading,
    (match) => ({ level: match[1].length }),
  ),
];


export const equation = (schema: Schema) => [
  replaceNodeRule(/^\$\$$/, schema.nodes.equation, undefined, true),
];

export const mathInline = (schema: Schema) => [
  insertNodeRule(
    // $Ax=b$ or $$, only select if there is not content.
    /(\$([^$]*)\$)$/,
    schema.nodes.math,
    (match: string[]) => {
      if (match[2] === '') return {};
      return { content: schema.text(match[2]) };
    },
    (match: string[]) => match[2] === '',
    (match: string[]) => {
      if (match[2].match(/^\d/) && match[2].match(/\s$/)) return false;
      return true;
    },
  ),
];

export const hr = (schema: Schema) => [
  insertNodeRule(/^(~~~|---|\*\*\*)$/, schema.nodes.horizontal_rule),
];

export const slider = (schema: Schema) => [
  insertNodeRule(
    /==([a-zA-Z0-9_]+)==$/, schema.nodes.range, (match: string[]) => ({ valueFunction: match[1], changeFunction: `{${match[1]}: value}` }),
  ),
];

export const dynamic = (schema: Schema) => [
  insertNodeRule(
    /<([a-zA-Z0-9_]+)>$/, schema.nodes.dynamic, (match: string[]) => ({ valueFunction: match[1], changeFunction: `{${match[1]}: value}` }),
  ),
];
