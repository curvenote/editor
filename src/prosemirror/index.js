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
import { schemas, fromHTML } from '@curvenote/schema';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { getSelectedViewId } from '../store/selectors';
import { store, opts } from '../connect';
import views from '../views';
import { isEditable } from './plugins/editable';
import { addLink, addLinkBlock } from '../store/actions/utils';
import { getPlugins } from './plugins';
import { uploadAndInsertImages } from './plugins/ImagePlaceholder';
import { selectEditorView } from '../store/actions';
export function createEditorState(useSchema, stateKey, content, version, startEditable) {
    var schema = schemas.getSchema(useSchema);
    var plugins = getPlugins(useSchema, schema, stateKey, version, startEditable);
    var state;
    try {
        var data = JSON.parse(content);
        state = EditorState.fromJSON({ schema: schema, plugins: plugins }, { doc: data, selection: { type: 'text', anchor: 0, head: 0 } });
    }
    catch (error) {
        var doc = fromHTML(content, schema, document, DOMParser);
        state = EditorState.create({ doc: doc, plugins: plugins });
    }
    return state;
}
export function createEditorView(dom, state, dispatch) {
    var shiftKey = false;
    var editorView = new EditorView({ mount: dom }, {
        state: state,
        dispatchTransaction: dispatch,
        nodeViews: __assign({ math: views.MathView, equation: views.EquationView, code_block: views.CodeBlockView, footnote: views.FootnoteView, image: views.ImageView, iframe: views.IFrameView, link: views.LinkView, link_block: views.createLinkBlockView, time: views.TimeView, mention: views.MentionView, button: views.newWidgetView, display: views.newWidgetView, dynamic: views.newWidgetView, range: views.newWidgetView, switch: views.newWidgetView, variable: views.newWidgetView }, opts.nodeViews),
        editable: function (s) { return isEditable(s); },
        handleKeyDown: function (_, event) {
            shiftKey = event.shiftKey;
            return false;
        },
        handlePaste: function (view, event, slice) {
            if (shiftKey)
                return false;
            if (!view.hasFocus())
                return true;
            var imageInSchema = view.state.schema.nodes.image;
            var uploadIfImagesInSchema = imageInSchema ? uploadAndInsertImages : function () { return false; };
            return (opts.handlePaste(view, event, slice) ||
                addLink(view, event.clipboardData) ||
                addLinkBlock(view, event.clipboardData) ||
                uploadIfImagesInSchema(view, event.clipboardData));
        },
        handleDrop: function (view, event) {
            var imageInSchema = view.state.schema.nodes.image;
            var uploadIfImagesInSchema = imageInSchema ? uploadAndInsertImages : function () { return false; };
            return uploadIfImagesInSchema(view, event.dataTransfer);
        },
        handleClick: function (view) {
            store.dispatch(selectEditorView(view.dom.id));
            return false;
        },
        handleDoubleClick: function (view, pos, event) {
            var _a = getSelectedViewId(store.getState()), viewId = _a.viewId, stateId = _a.stateId;
            return opts.onDoubleClick(stateId, viewId, view, pos, event);
        },
    });
    return editorView;
}
//# sourceMappingURL=index.js.map