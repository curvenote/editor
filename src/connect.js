import * as sidenotes from 'sidenotes';
import { Fragment } from 'prosemirror-model';
import { process } from '@curvenote/schema';
import setupComponents from './r-components';
export var ref = {
    store: function () {
        if (ref._store === undefined)
            throw new Error('Must init store.');
        return ref._store;
    },
    opts: function () {
        if (ref._opts === undefined)
            throw new Error('Must init opts.');
        return ref._opts;
    },
};
export function setup(store, opts) {
    ref._store = store;
    ref._opts = opts;
    setupComponents(store);
    sidenotes.setup(store, { padding: 10 });
}
export var store = {
    getState: function () { return ref.store().getState(); },
    dispatch: function (action) { return ref.store().dispatch(action); },
};
export var opts = {
    transformKeyToId: function (key) { return ref.opts().transformKeyToId(key); },
    uploadImage: function (file, node) {
        return ref.opts().uploadImage(file, node);
    },
    handlePaste: function (view, event, slice) {
        var _a, _b, _c;
        return (_c = (_b = (_a = ref.opts()).handlePaste) === null || _b === void 0 ? void 0 : _b.call(_a, view, event, slice)) !== null && _c !== void 0 ? _c : false;
    },
    modifyTransaction: function (stateKey, viewId, state, tr) {
        var modifyTransaction = ref.opts().modifyTransaction;
        var next = tr;
        switch (tr.getMeta('uiEvent')) {
            case 'cut':
            case 'paste':
            case 'drop':
                next = process.modifyTransactionToValidDocState(tr);
                break;
            default:
                break;
        }
        if (modifyTransaction) {
            return modifyTransaction(stateKey, viewId, state, next);
        }
        return next;
    },
    addComment: function (stateKey, state) {
        var _a, _b, _c;
        return (_c = (_b = (_a = ref.opts()).addComment) === null || _b === void 0 ? void 0 : _b.call(_a, stateKey, state)) !== null && _c !== void 0 ? _c : false;
    },
    onDoubleClick: function (stateId, viewId, view, pos, event) {
        var _a, _b, _c;
        return (_c = (_b = (_a = ref.opts()).onDoubleClick) === null || _b === void 0 ? void 0 : _b.call(_a, stateId, viewId, view, pos, event)) !== null && _c !== void 0 ? _c : false;
    },
    getDocId: function () {
        return ref.opts().getDocId();
    },
    citationPrompt: function () {
        return ref.opts().citationPrompt();
    },
    createLinkSearch: function () {
        return ref.opts().createLinkSearch();
    },
    getCaptionFragment: function (schema, src) {
        var _a, _b, _c;
        return (_c = (_b = (_a = ref.opts()).getCaptionFragment) === null || _b === void 0 ? void 0 : _b.call(_a, schema, src)) !== null && _c !== void 0 ? _c : Fragment.empty;
    },
    get theme() {
        return ref.opts().theme;
    },
    get throttle() {
        return ref.opts().throttle;
    },
    get nodeViews() {
        var _a;
        return (_a = ref.opts().nodeViews) !== null && _a !== void 0 ? _a : {};
    },
};
//# sourceMappingURL=connect.js.map