var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { inputRules } from 'prosemirror-inputrules';
import * as rules from './rules';
export * from './rules';
var inputrules = function (schema) {
    return inputRules({
        rules: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], rules.quotes(schema), true), rules.ellipsis(schema), true), rules.blockquote(schema), true), rules.arrows(schema), true), rules.emojis(schema), true), rules.fractions(schema), true), rules.emdash(schema), true), rules.copyright(schema), true), rules.link(schema), true), rules.lists(schema), true), rules.codeBlock(schema), true), rules.codeInline(schema), true), rules.strong(schema), true), rules.em(schema), true), rules.hr(schema), true), rules.strikethrough(schema), true), rules.headings(schema), true), rules.equation(schema), true), rules.mathInline(schema), true), rules.slider(schema), true),
    });
};
export default inputrules;
//# sourceMappingURL=index.js.map