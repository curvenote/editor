import { InputRule, wrappingInputRule, textblockTypeInputRule, smartQuotes, } from 'prosemirror-inputrules';
import { insertNodeRule, markInputRule, replaceNodeRule } from './utils';
import { TEST_LINK_COMMON_SPACE, TEST_LINK_SPACE } from '../../store/actions/utils';
export var quotes = function (schema) { return smartQuotes; };
export var ellipsis = function (schema) { return [new InputRule(/\.\.\.$/, '…')]; };
export var blockquote = function (schema) { return [wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote)]; };
export var arrows = function (schema) { return [
    new InputRule(/<--?>\s$/, '↔ '),
    new InputRule(/<==?>\s$/, '⇔ '),
    new InputRule(/-?->\s$/, '→ '),
    new InputRule(/=?=>\s$/, '⇒ '),
    new InputRule(/<--?\s$/, '← '),
    new InputRule(/<==?\s$/, '⇐ '),
]; };
export var emdash = function (schema) { return [
    new InputRule(/--\s$/, '— '),
]; };
export var copyright = function (schema) { return [
    new InputRule(/\s?\(c\)\s$/, ' © '),
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
    textblockTypeInputRule(/^```$/, schema.nodes.code_block),
]; };
export var codeInline = function (schema) { return [
    markInputRule(/`([\W\w]+)`$/, schema.marks.code),
]; };
export var strong = function (schema) { return [
    markInputRule(/\*\*([\W\w]+)\*\*$/, schema.marks.strong),
    markInputRule(/__([\W\w]+)__$/, schema.marks.strong),
]; };
export var strikethrough = function (schema) { return [
    markInputRule(/~([\W\w]+)~$/, schema.marks.strikethrough),
]; };
export var em = function (schema) { return [
    markInputRule(/(\s|^)\*(?!\*)([\W\w]+)\*$/, schema.marks.em, {
        getText: function (match) { return (match[1] ? " " + match[2] : match[2]); },
    }),
    markInputRule(/(\s|^)_(?!_)([\W\w]+)_$/, schema.marks.em, {
        getText: function (match) { return (match[1] ? " " + match[2] : match[2]); },
    }),
]; };
export var headings = function (schema, maxLevel) {
    if (maxLevel === void 0) { maxLevel = 6; }
    return [
        textblockTypeInputRule(new RegExp("^(#{1," + maxLevel + "})\\s$"), schema.nodes.heading, function (match) { return ({ level: match[1].length }); }),
    ];
};
export var equation = function (schema) { return [
    replaceNodeRule(/^\$\$$/, schema.nodes.equation, undefined, true),
]; };
export var mathInline = function (schema) { return [
    insertNodeRule(/(\$([^$]*)\$)$/, schema.nodes.math, function (match) {
        if (match[2] === '')
            return {};
        return { content: schema.text(match[2]) };
    }, function (match) { return match[2] === ''; }, function (match) {
        if (match[2].match(/^\d/) && match[2].match(/\s$/))
            return false;
        return true;
    }),
]; };
export var hr = function (schema) { return [
    insertNodeRule(/^(~~~|---|\*\*\*)$/, schema.nodes.horizontal_rule),
]; };
export var slider = function (schema) { return [
    insertNodeRule(/==([a-zA-Z0-9_]+)==$/, schema.nodes.range, function (match) { return ({ valueFunction: match[1], changeFunction: "{" + match[1] + ": value}" }); }),
]; };
export var dynamic = function (schema) { return [
    insertNodeRule(/<([a-zA-Z0-9_]+)>$/, schema.nodes.dynamic, function (match) { return ({ valueFunction: match[1], changeFunction: "{" + match[1] + ": value}" }); }),
]; };
//# sourceMappingURL=rules.js.map