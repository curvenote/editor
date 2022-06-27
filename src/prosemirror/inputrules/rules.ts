/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InputRule,
  wrappingInputRule,
  textblockTypeInputRule,
  smartQuotes,
} from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { createId } from '@curvenote/schema';
import { changeNodeRule, markInputRule, replaceNodeRule } from './utils';
import {
  normalizeUrl,
  TEST_LINK_COMMON_SPACE,
  TEST_LINK_SPACE,
  validateEmail,
} from '../../store/actions/utils';
import { LanguageNames } from '../../views/types';

export const quotes = (schema: Schema) => smartQuotes;
export const ellipsis = (schema: Schema) => [new InputRule(/\.\.\.$/, '…')];

export const blockquote = (schema: Schema) => [
  wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote),
];

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

// Match on fractions that are not part of a number sequence
export const fractions = (schema: Schema) => [
  new InputRule(/(?:^|[^\d,])(1\/2)$/, '½'),
  new InputRule(/(?:^|[^\d,])(1\/3)$/, '⅓'),
  new InputRule(/(?:^|[^\d,])(2\/3)$/, '⅔'),
  new InputRule(/(?:^|[^\d,])(1\/4)$/, '¼'),
  new InputRule(/(?:^|[^\d,])(1\/5)$/, '⅕'),
  new InputRule(/(?:^|[^\d,])(2\/5)$/, '⅖'),
  new InputRule(/(?:^|[^\d,])(3\/5)$/, '⅗'),
  new InputRule(/(?:^|[^\d,])(4\/5)$/, '⅘'),
  new InputRule(/(?:^|[^\d,])(1\/6)$/, '⅙'),
  new InputRule(/(?:^|[^\d,])(5\/6)$/, '⅚'),
  new InputRule(/(?:^|[^\d,])(1\/7)$/, '⅐'),
  new InputRule(/(?:^|[^\d,])(1\/8)$/, '⅛'),
  new InputRule(/(?:^|[^\d,])(3\/8)$/, '⅜'),
  new InputRule(/(?:^|[^\d,])(5\/8)$/, '⅝'),
  new InputRule(/(?:^|[^\d,])(7\/8)$/, '⅞'),
  new InputRule(/(?:^|[^\d,])(1\/9)$/, '⅑'),
  new InputRule(/(?:^|[^\d,])(1\/10)$/, '⅒'),
];

export const emdash = (schema: Schema) => [new InputRule(/--\s$/, '— ')];

export const copyright = (schema: Schema) => [
  // Capture a rule that looks for (b) first. Only create a © if you don't find that!
  new InputRule(/(?:\(b\).*\(c\))(\s)$/, ' '),
  new InputRule(/(\(c\)\s)$/, '© '),
  new InputRule(/(\(r\)\s)$/, '® '),
];

function normalize(match: string[]) {
  const url = match[0].slice(0, -1);
  if (validateEmail(url)) {
    return { href: `mailto:${url}`, text: url };
  }
  return { href: normalizeUrl(url) };
}

export const link = (schema: Schema) => [
  markInputRule(TEST_LINK_SPACE, schema.marks.link, {
    getAttrs: normalize,
    addSpace: true,
  }),
  markInputRule(TEST_LINK_COMMON_SPACE, schema.marks.link, {
    getAttrs: normalize,
    addSpace: true,
  }),
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
  textblockTypeInputRule(/^```$/, schema.nodes.code_block, {
    id: createId(),
    language: LanguageNames.Python,
  }),
];

export const strong = (schema: Schema) => [
  markInputRule(/\*\*([\W\w]+)\*\*$/, schema.marks.strong),
  markInputRule(/__([\W\w]+)__$/, schema.marks.strong),
];

export const strikethrough = (schema: Schema) => [
  markInputRule(/~([\W\w]+[^\s])~$/, schema.marks.strikethrough),
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
  textblockTypeInputRule(new RegExp(`^(#{1,${maxLevel}})\\s$`), schema.nodes.heading, (match) => ({
    level: match[1].length,
    id: createId(),
  })),
];

export const equation = (schema: Schema) => [
  changeNodeRule(/^\$\$$/, schema.nodes.equation, () => ({ id: createId() })),
];

export const mathInline = (schema: Schema) => [
  replaceNodeRule(
    // $Ax=b$ or $$, only select if there is not content.
    /(\$([^$]*)\$)$/,
    schema.nodes.math,
    (match: string[]) => {
      if (match[2] === '') return {};
      return { content: schema.text(match[2]) };
    },
    (match: string[]) => match[2] === '',
    (match: string[]) => {
      // "$1.00 and $"
      // "$1.00 and ($"
      if (match[2].match(/^\d/) && match[2].match(/(\s|\()$/)) return false;
      return true;
    },
  ),
];

export const hr = (schema: Schema) => [
  replaceNodeRule(/^(~~~|---|\*\*\*)$/, schema.nodes.horizontal_rule),
];

export const slider = (schema: Schema) => [
  replaceNodeRule(/==([a-zA-Z0-9_]+)==$/, schema.nodes.range, (match: string[]) => ({
    valueFunction: match[1],
    changeFunction: `{${match[1]}: value}`,
  })),
];
