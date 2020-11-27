/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  InputRule, wrappingInputRule, textblockTypeInputRule,
  smartQuotes,
} from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { insertNodeRule, markInputRule } from './utils';

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
];

export const emdash = (schema: Schema) => [
  new InputRule(/--\s$/, '— '),
];

export const copyright = (schema: Schema) => [
  new InputRule(/\s?\(c\)\s$/, ' © '),
];

export const link = (schema: Schema) => [
  markInputRule(
    /((https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))\s$/,
    schema.marks.link,
    (match: string[]) => ({ href: match[0].slice(0, -1) }),
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

export const headings = (schema: Schema, maxLevel = 6) => [
  textblockTypeInputRule(
    new RegExp(`^(#{1,${maxLevel}})\\s$`),
    schema.nodes.heading,
    (match) => ({ level: match[1].length }),
  ),
];

export const mathInline = (schema: Schema) => [
  insertNodeRule(
    // $Ax=b$ or $$, only select if there is not content.
    /(\$([\W\w]*)\$)$/,
    schema.nodes.math,
    (match: string[]) => {
      if (match[2] === '') return {};
      return { content: schema.text(match[2]) };
    },
    (match: string[]) => match[2] === '',
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
