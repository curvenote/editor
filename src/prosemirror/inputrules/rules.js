import { InputRule, wrappingInputRule, textblockTypeInputRule, smartQuotes, } from 'prosemirror-inputrules';
import { createId } from '@curvenote/schema';
import { changeNodeRule, markInputRule, replaceNodeRule } from './utils';
import { TEST_LINK_COMMON_SPACE, TEST_LINK_SPACE } from '../../store/actions/utils';
import { LanguageNames } from '../../views/types';
export var quotes = function (schema) { return smartQuotes; };
export var ellipsis = function (schema) { return [new InputRule(/\.\.\.$/, '…')]; };
export var blockquote = function (schema) { return [
    wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote),
]; };
export var arrows = function (schema) { return [
    new InputRule(/<--?>\s$/, '↔ '),
    new InputRule(/<==?>\s$/, '⇔ '),
    new InputRule(/-?->\s$/, '→ '),
    new InputRule(/=?=>\s$/, '⇒ '),
    new InputRule(/<--?\s$/, '← '),
    new InputRule(/<==?\s$/, '⇐ '),
    new InputRule(/>>\s$/, '» '),
    new InputRule(/<<\s$/, '« '),
]; };
export var emojis = function (schema) { return [
    new InputRule(/(?:^|\s)<3\s$/, '❤️ '),
    new InputRule(/(?:^|\s)<\/3\s$/, '💔 '),
    new InputRule(/(?:^|\s)\+1\s$/, '👍 '),
]; };
export var fractions = function (schema) { return [
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
]; };
export var emdash = function (schema) { return [new InputRule(/--\s$/, '— ')]; };
export var copyright = function (schema) { return [
    new InputRule(/(?:\(b\).*\(c\))(\s)$/, ' '),
    new InputRule(/(\(c\)\s)$/, '© '),
    new InputRule(/(\(r\)\s)$/, '® '),
]; };
export var link = function (schema) { return [
    markInputRule(TEST_LINK_SPACE, schema.marks.link, {
        getAttrs: function (match) { return ({ href: match[0].slice(0, -1) }); },
        addSpace: true,
    }),
    markInputRule(TEST_LINK_COMMON_SPACE, schema.marks.link, {
        getAttrs: function (match) { return ({ href: match[0].slice(0, -1) }); },
        addSpace: true,
    }),
]; };
export var lists = function (schema) { return [
    wrappingInputRule(/^\s*(\d+)\.\s$/, schema.nodes.ordered_list, function (match) { return ({ order: +match[1] }); }, function (match, node) { return node.childCount + node.attrs.order === +match[1]; }),
    wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bullet_list),
]; };
export var codeBlock = function (schema) { return [
    textblockTypeInputRule(/^```$/, schema.nodes.code_block, {
        id: createId(),
        language: LanguageNames.Python,
    }),
]; };
export var strong = function (schema) { return [
    markInputRule(/\*\*([\W\w]+)\*\*$/, schema.marks.strong),
    markInputRule(/__([\W\w]+)__$/, schema.marks.strong),
]; };
export var strikethrough = function (schema) { return [
    markInputRule(/~([\W\w]+[^\s])~$/, schema.marks.strikethrough),
]; };
export var em = function (schema) { return [
    markInputRule(/(\s|^)\*(?!\*)([\W\w]+)\*$/, schema.marks.em, {
        getText: function (match) { return (match[1] ? " ".concat(match[2]) : match[2]); },
    }),
    markInputRule(/(\s|^)_(?!_)([\W\w]+)_$/, schema.marks.em, {
        getText: function (match) { return (match[1] ? " ".concat(match[2]) : match[2]); },
    }),
]; };
export var headings = function (schema, maxLevel) {
    if (maxLevel === void 0) { maxLevel = 6; }
    return [
        textblockTypeInputRule(new RegExp("^(#{1,".concat(maxLevel, "})\\s$")), schema.nodes.heading, function (match) { return ({
            level: match[1].length,
            id: createId(),
        }); }),
    ];
};
export var equation = function (schema) { return [
    changeNodeRule(/^\$\$$/, schema.nodes.equation, function () { return ({ id: createId() }); }),
]; };
export var mathInline = function (schema) { return [
    replaceNodeRule(/(\$([^$]*)\$)$/, schema.nodes.math, function (match) {
        if (match[2] === '')
            return {};
        return { content: schema.text(match[2]) };
    }, function (match) { return match[2] === ''; }, function (match) {
        if (match[2].match(/^\d/) && match[2].match(/(\s|\()$/))
            return false;
        return true;
    }),
]; };
export var hr = function (schema) { return [
    replaceNodeRule(/^(~~~|---|\*\*\*)$/, schema.nodes.horizontal_rule),
]; };
export var slider = function (schema) { return [
    replaceNodeRule(/==([a-zA-Z0-9_]+)==$/, schema.nodes.range, function (match) { return ({
        valueFunction: match[1],
        changeFunction: "{".concat(match[1], ": value}"),
    }); }),
]; };
//# sourceMappingURL=rules.js.map