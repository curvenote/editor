var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { InputRule } from 'prosemirror-inputrules';
import { NodeSelection } from 'prosemirror-state';
export function markInputRule(regexp, markType, options) {
    return new InputRule(regexp, function (state, match, start, end) {
        var _a;
        var _b = options !== null && options !== void 0 ? options : {}, getAttrs = _b.getAttrs, getText = _b.getText, addSpace = _b.addSpace;
        var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        var tr = state.tr;
        if (state.doc.rangeHasMark(start, end, markType)) {
            return null;
        }
        var mark = markType.create(attrs);
        tr.delete(start, end);
        var text = (_a = getText === null || getText === void 0 ? void 0 : getText(match)) !== null && _a !== void 0 ? _a : match[1];
        tr.insertText(text);
        tr.addMark(start, start + text.length, mark);
        tr.removeStoredMark(markType);
        if (addSpace)
            tr.insertText(' ');
        return tr;
    });
}
export function insertNodeRule(regExp, nodeType, getAttrs, select) {
    if (select === void 0) { select = false; }
    return new InputRule(regExp, function (state, match, start, end) {
        var _a, _b, _c;
        var _d = (_a = (getAttrs instanceof Function ? getAttrs(match) : getAttrs)) !== null && _a !== void 0 ? _a : {}, content = _d.content, attrs = __rest(_d, ["content"]);
        var tr = state.tr.delete(start, end).replaceSelectionWith(nodeType.create(attrs, content), false).scrollIntoView();
        var doSelect = select instanceof Function ? select(match) : select;
        if (!doSelect)
            return tr;
        var nodeSize = (_c = (_b = tr.selection.$anchor.nodeBefore) === null || _b === void 0 ? void 0 : _b.nodeSize) !== null && _c !== void 0 ? _c : 0;
        var resolvedPos = tr.doc.resolve(tr.selection.anchor - nodeSize);
        var selected = tr.setSelection(new NodeSelection(resolvedPos));
        return selected;
    });
}
export function replaceNodeRule(regExp, nodeType, getAttrs, select) {
    if (select === void 0) { select = false; }
    return new InputRule(regExp, function (state, match, start, end) {
        var _a;
        var _b = (_a = (getAttrs instanceof Function ? getAttrs(match) : getAttrs)) !== null && _a !== void 0 ? _a : {}, content = _b.content, attrs = __rest(_b, ["content"]);
        var tr = state.tr.delete(start, end).replaceSelectionWith(nodeType.create(attrs, content), false).scrollIntoView();
        var doSelect = select instanceof Function ? select(match) : select;
        if (!doSelect)
            return tr;
        var resolvedPos = tr.doc.resolve(start - 1);
        var selected = tr.setSelection(new NodeSelection(resolvedPos));
        return selected;
    });
}
//# sourceMappingURL=utils.js.map