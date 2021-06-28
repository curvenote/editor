var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { inputRules } from 'prosemirror-inputrules';
import * as rules from './rules';
export * from './rules';
var inputrules = function (schema) {
    return inputRules({
        rules: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], rules.quotes(schema)), rules.ellipsis(schema)), rules.blockquote(schema)), rules.arrows(schema)), rules.emojis(schema)), rules.fractions(schema)), rules.emdash(schema)), rules.copyright(schema)), rules.link(schema)), rules.lists(schema)), rules.codeBlock(schema)), rules.codeInline(schema)), rules.strong(schema)), rules.em(schema)), rules.hr(schema)), rules.strikethrough(schema)), rules.headings(schema)), rules.equation(schema)), rules.mathInline(schema)), rules.slider(schema)), rules.dynamic(schema)),
    });
};
export default inputrules;
//# sourceMappingURL=index.js.map