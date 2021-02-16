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
import { Plugin, PluginKey, } from 'prosemirror-state';
import { isNodeSelection } from 'prosemirror-utils';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { actions, selectors, store } from 'sidenotes';
import { opts } from '../../connect';
var emptyCommentState = {
    decorations: DecorationSet.empty,
};
export var key = new PluginKey('comments');
export function dispatchCommentAction(view, action) {
    var plugin = key.get(view.state);
    var tr = view.state.tr.setMeta(plugin, action);
    view.dispatch(tr);
}
function inComment(selection, decorations) {
    return decorations.find(selection.from, selection.to).length > 0;
}
var reducer = function (state, tr, action) {
    var decorations = state.decorations;
    var nextDecorations = decorations.map(tr.mapping, tr.doc);
    switch (action === null || action === void 0 ? void 0 : action.type) {
        case 'add': {
            var _a = tr.selection, from = _a.from, to = _a.to;
            var deco = void 0;
            var params = {
                nodeName: 'span',
                comment: action.commentId,
                class: 'anchor',
            };
            var spec = {
                comment: action.commentId,
                inclusiveStart: false,
                inclusiveEnd: false,
            };
            if (isNodeSelection(tr.selection)) {
                deco = Decoration.node(from, to, params, spec);
            }
            else {
                deco = Decoration.inline(from, to, params, spec);
            }
            return nextDecorations.add(tr.doc, [deco]);
        }
        case 'remove': {
            var commentId_1 = action.commentId;
            var deco = nextDecorations.find(undefined, undefined, function (spec) { return spec.comment === commentId_1; });
            return nextDecorations.remove(deco);
        }
        default:
            return nextDecorations;
    }
};
var getCommentsPlugin = function () {
    var commentsPlugin = new Plugin({
        key: key,
        state: {
            init: function () { return (__assign({}, emptyCommentState)); },
            apply: function (tr, state) {
                var action = tr.getMeta(commentsPlugin);
                var docId = opts.getDocId();
                var decorations = reducer(state, tr, action);
                var around = decorations.find(tr.selection.from, tr.selection.to);
                if (around.length === 0) {
                    var hasSelectedComment = selectors.selectedSidenote(store.getState(), docId);
                    if (hasSelectedComment)
                        store.dispatch(actions.deselectSidenote(docId));
                }
                else {
                    var commentId = around[0].spec.comment;
                    var isSelected = selectors.isSidenoteSelected(store.getState(), docId, commentId);
                    if (!isSelected) {
                        store.dispatch(actions.selectSidenote(docId, commentId));
                    }
                }
                return {
                    decorations: decorations,
                };
            },
        },
        props: {
            decorations: function (state) { return commentsPlugin.getState(state).decorations; },
        },
    });
    return commentsPlugin;
};
export default getCommentsPlugin;
//# sourceMappingURL=comments.js.map