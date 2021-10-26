var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { nodeNames, findChildrenWithName, CaptionKind, createId } from '@curvenote/schema';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { determineCaptionKind } from '@curvenote/schema/dist/process';
import { Fragment } from 'prosemirror-model';
import { opts } from '../../connect';
export { findChildrenWithName };
export var TEST_LINK = /((https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))$/;
export var TEST_LINK_WEAK = /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))$/;
export var TEST_LINK_SPACE = /((https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))\s$/;
export var TEST_LINK_COMMON_SPACE = /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[com|org|app|dev|io|net|gov|edu]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))\s$/;
export var testLink = function (possibleLink) {
    var match = TEST_LINK.exec(possibleLink);
    return Boolean(match);
};
export var testLinkWeak = function (possibleLink) {
    var match = TEST_LINK_WEAK.exec(possibleLink);
    return Boolean(match);
};
export var addLink = function (view, data) {
    var _a;
    var href = (_a = data === null || data === void 0 ? void 0 : data.getData('text/plain')) !== null && _a !== void 0 ? _a : '';
    if (!testLink(href))
        return false;
    var schema = view.state.schema;
    var node = schema.text(href, [schema.marks.link.create({ href: href })]);
    var tr = view.state.tr.replaceSelectionWith(node, false).scrollIntoView();
    view.dispatch(tr);
    return true;
};
export function updateNodeAttrsOnView(view, node, attrs, select) {
    if (select === void 0) { select = true; }
    if (view == null)
        return;
    var tr = view.state.tr.setNodeMarkup(node.pos, undefined, __assign(__assign({}, node.node.attrs), attrs));
    if (select === true)
        tr.setSelection(NodeSelection.create(tr.doc, node.pos));
    if (select === 'after') {
        var sel = TextSelection.create(tr.doc, node.pos + node.node.nodeSize);
        tr.setSelection(sel);
    }
    view.dispatch(tr);
    view.focus();
}
export function createFigureCaption(schema, kind, src) {
    var FigcaptionNode = schema.nodes[nodeNames.figcaption];
    var fragment = src ? opts.getCaptionFragment(schema, src) : Fragment.empty;
    var captionAttrs = { kind: kind };
    var caption = FigcaptionNode.create(captionAttrs, fragment);
    return caption;
}
export function createFigure(schema, node, caption, initialFigureState) {
    var _a;
    if (caption === void 0) { caption = false; }
    if (initialFigureState === void 0) { initialFigureState = {}; }
    var Figure = schema.nodes[nodeNames.figure];
    var kind = (_a = determineCaptionKind(node)) !== null && _a !== void 0 ? _a : CaptionKind.fig;
    var attrs = __assign({ id: createId(), label: null, numbered: true, align: 'center' }, initialFigureState);
    if (!caption) {
        var figure_1 = Figure.createAndFill(attrs, Fragment.fromArray([node]));
        return figure_1;
    }
    var captionNode = createFigureCaption(schema, kind, node.attrs.src);
    var captionFirst = kind === CaptionKind.table;
    var figure = Figure.createAndFill(attrs, Fragment.fromArray(captionFirst ? [captionNode, node] : [node, captionNode]));
    return figure;
}
export function selectFirstNodeOfTypeInParent(nodeName, tr, parentPos) {
    var pos = tr.doc.resolve(parentPos);
    var parent = pos.nodeAfter;
    if (!parent)
        return tr;
    var node = findChildrenWithName(parent, nodeName)[0];
    if (!node)
        return tr;
    var start = parentPos + 1;
    try {
        var selected = tr
            .setSelection(NodeSelection.create(tr.doc, start + node.pos))
            .scrollIntoView();
        return selected;
    }
    catch (error) {
        console.error("Could not select the " + (typeof nodeName === 'string' ? nodeName : nodeName.join(', ')) + " node.");
        return tr;
    }
}
export function insertParagraphAndSelect(schema, tr, side) {
    var paragraph = schema.nodes[nodeNames.paragraph].createAndFill();
    var next = tr.insert(side, paragraph);
    next.setSelection(TextSelection.create(next.doc, side + 1)).scrollIntoView();
    return next;
}
function getLinkBounds(state, pos) {
    var $pos = state.doc.resolve(pos);
    var parent = $pos.parent, parentOffset = $pos.parentOffset;
    var start = parent.childAfter(parentOffset);
    if (!start.node)
        return null;
    var link = start.node.marks.find(function (mark) { return mark.type === state.schema.marks.link; });
    if (!link)
        return null;
    var startIndex = $pos.index();
    var startPos = $pos.start() + start.offset;
    var endIndex = startIndex + 1;
    var endPos = startPos + start.node.nodeSize;
    while (startIndex > 0 && link.isInSet(parent.child(startIndex - 1).marks)) {
        startIndex -= 1;
        startPos -= parent.child(startIndex).nodeSize;
    }
    while (endIndex < parent.childCount && link.isInSet(parent.child(endIndex).marks)) {
        endPos += parent.child(endIndex).nodeSize;
        endIndex += 1;
    }
    return { from: startPos, to: endPos, mark: link };
}
export function getLinkBoundsIfTheyExist(state, pos) {
    if (!state)
        return null;
    var _a = state.selection, from = _a.from, $from = _a.$from, to = _a.to, $to = _a.$to, empty = _a.empty;
    if (pos != null) {
        from = pos;
        $from = state.doc.resolve(pos);
        $to = $from;
        to = pos;
        empty = true;
    }
    var mark = state.schema.marks.link;
    var searchForLink = empty
        ? Boolean(mark.isInSet(state.storedMarks || $from.marks()))
        : state.doc.rangeHasMark(from, to, mark);
    var linkBounds = searchForLink ? getLinkBounds(state, from) : null;
    var hasLink = Boolean((mark.isInSet($from.marks()) || from === (linkBounds === null || linkBounds === void 0 ? void 0 : linkBounds.from)) &&
        (mark.isInSet($to.marks()) || to === (linkBounds === null || linkBounds === void 0 ? void 0 : linkBounds.to)));
    if (!hasLink || !linkBounds)
        return null;
    return linkBounds;
}
//# sourceMappingURL=utils.js.map