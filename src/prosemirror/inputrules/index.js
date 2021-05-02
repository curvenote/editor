var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { inputRules } from 'prosemirror-inputrules';
import * as rules from './rules';
export * from './rules';
var inputrules = function (schema) { return inputRules({
    rules: __spreadArrays(rules.quotes(schema), rules.ellipsis(schema), rules.blockquote(schema), rules.arrows(schema), rules.emdash(schema), rules.copyright(schema), rules.link(schema), rules.lists(schema), rules.codeBlock(schema), rules.codeInline(schema), rules.strong(schema), rules.em(schema), rules.hr(schema), rules.strikethrough(schema), rules.headings(schema), rules.equation(schema), rules.mathInline(schema), rules.slider(schema), rules.dynamic(schema)),
}); };
export default inputrules;
//# sourceMappingURL=index.js.map