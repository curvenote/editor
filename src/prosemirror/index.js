import { migrateHTML } from '@curvenote/schema';
import { EditorState } from 'prosemirror-state';
import { DOMParser as Parser } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { getSelectedViewId } from '../store/selectors';
import schema from './schema';
import { store, opts } from '../connect';
import * as views from './views';
import { isEditable } from './plugins/editable';
import { addLink } from './utils';
import { getPlugins } from './plugins';
export { schema };
export function createEditorState(stateKey, content, version, startEditable) {
    var plugins = getPlugins(stateKey, version, startEditable);
    var state;
    try {
        var data = JSON.parse(content);
        state = EditorState.fromJSON({ schema: schema, plugins: plugins }, { doc: data, selection: { type: 'text', anchor: 0, head: 0 } });
    }
    catch (error) {
        var element = migrateHTML(content, document, DOMParser);
        var doc = Parser.fromSchema(schema).parse(element);
        state = EditorState.create({ doc: doc, plugins: plugins });
    }
    return state;
}
export function createEditorView(dom, state, dispatch) {
    var editorView = new EditorView(dom, {
        state: state,
        dispatchTransaction: dispatch,
        nodeViews: {
            math: function (node, view, getPos) {
                return new views.MathView(node, view, getPos, true);
            },
            equation: function (node, view, getPos) {
                return new views.MathView(node, view, getPos, false);
            },
            image: function (node, view, getPos) {
                return new views.ImageView(node, view, getPos);
            },
            iframe: function (node, view, getPos) {
                return new views.IFrameView(node, view, getPos);
            },
            link: function (node, view, getPos) {
                return new views.LinkView(node, view, getPos);
            },
            cite: function (node, view, getPos) {
                return new views.CiteView(node, view, getPos);
            },
            button: views.newWidgetView,
            display: views.newWidgetView,
            dynamic: views.newWidgetView,
            range: views.newWidgetView,
            switch: views.newWidgetView,
            variable: views.newWidgetView,
        },
        editable: function (s) { return isEditable(s); },
        handlePaste: function (view, event) {
            if (!view.hasFocus())
                return true;
            return (addLink(view, event.clipboardData)
                || views.image.uploadAndInsertImages(view, event.clipboardData));
        },
        handleDrop: function (view, event) { return (views.image.uploadAndInsertImages(view, event.dataTransfer)); },
        handleDoubleClick: function (view, pos, event) {
            var _a = getSelectedViewId(store.getState()), viewId = _a.viewId, stateId = _a.stateId;
            return opts.onDoubleClick(stateId, viewId, view, pos, event);
        },
    });
    return editorView;
}
//# sourceMappingURL=index.js.map