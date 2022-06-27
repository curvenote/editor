import { NodeSelection } from 'prosemirror-state';
import { process } from '@curvenote/schema';
import { UPDATE_EDITOR_STATE, INIT_EDITOR_STATE, SUBSCRIBE_EDITOR_VIEW, UNSUBSCRIBE_EDITOR_VIEW, RESET_ALL_EDITORS_AND_VIEWS, RESET_ALL_VIEWS, RESET_EDITOR_AND_VIEWS, } from './types';
import { getEditorState, getEditorView } from './selectors';
import { opts } from '../../connect';
import { getLinkBoundsIfTheyExist } from '../actions/utils';
export function initEditorState(useSchema, stateKey, editable, content, version) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    return {
        type: INIT_EDITOR_STATE,
        payload: {
            useSchema: useSchema,
            stateKey: stateKey,
            stateId: stateId,
            editable: editable,
            content: content,
            version: version,
        },
    };
}
export function updateEditorState(stateKey, viewId, editorState, tr) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    var counts = (tr === null || tr === void 0 ? void 0 : tr.docChanged) ? process.countState(editorState) : null;
    return {
        type: UPDATE_EDITOR_STATE,
        payload: {
            stateId: stateId,
            viewId: viewId,
            editorState: editorState,
            counts: counts,
            tr: tr,
        },
    };
}
export function applyProsemirrorTransaction(stateKey, viewId, tr, focus) {
    if (focus === void 0) { focus = false; }
    return function (dispatch, getState) {
        var view = getEditorView(getState(), viewId).view;
        if (view && view.state) {
            var transact = typeof tr === 'function' ? tr(view.state.tr, view) : tr;
            view.dispatch(transact);
            if (focus)
                view.focus();
            return true;
        }
        if (typeof tr === 'function')
            return true;
        var editor = getEditorState(getState(), stateKey);
        if (editor.state == null)
            return true;
        var next = editor.state.apply(tr);
        dispatch(updateEditorState(stateKey, null, next, tr));
        return true;
    };
}
export function subscribeView(stateKey, viewId, view) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    return {
        type: SUBSCRIBE_EDITOR_VIEW,
        payload: { stateId: stateId, viewId: viewId, view: view },
    };
}
export function unsubscribeView(stateKey, viewId) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    return {
        type: UNSUBSCRIBE_EDITOR_VIEW,
        payload: { stateId: stateId, viewId: viewId },
    };
}
export function resetAllEditorsAndViews() {
    return {
        type: RESET_ALL_EDITORS_AND_VIEWS,
    };
}
export function resetAllViews() {
    return {
        type: RESET_ALL_VIEWS,
    };
}
export function resetEditorAndViews(stateKey) {
    var stateId = opts.transformKeyToId(stateKey);
    if (stateId == null)
        throw new Error('Must have a state ID');
    return {
        type: RESET_EDITOR_AND_VIEWS,
        payload: {
            stateId: stateId,
        },
    };
}
export function switchLinkType(_a) {
    var linkType = _a.linkType, stateId = _a.stateId, viewId = _a.viewId, url = _a.url;
    return function (dispatch, getState) {
        var _a;
        var state = (_a = getEditorState(getState(), stateId)) === null || _a === void 0 ? void 0 : _a.state;
        if (!state)
            return;
        var from = state.selection.from;
        var selection = (state === null || state === void 0 ? void 0 : state.doc) ? NodeSelection.create(state.doc, state.selection.from) : null;
        var node = selection === null || selection === void 0 ? void 0 : selection.node;
        if (!selection || !node)
            return;
        if (linkType === 'link') {
            var mark = state === null || state === void 0 ? void 0 : state.schema.marks.link;
            var link = mark.create({ href: url });
            var tr = state.tr.replaceRangeWith(from, from + node.nodeSize, state.schema.text(url, [link]));
            dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
        }
        else if (linkType === 'link-block') {
            var linkBounds = getLinkBoundsIfTheyExist(state);
            if (!linkBounds)
                return;
            var newNode = state.schema.nodes.link_block.createAndFill({
                title: '',
                description: '',
                url: url,
            });
            var tr = state.tr.replaceRangeWith(linkBounds.from, linkBounds.to, newNode);
            dispatch(applyProsemirrorTransaction(stateId, viewId, tr));
        }
    };
}
//# sourceMappingURL=actions.js.map