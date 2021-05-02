import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { useCitation } from '../components/Citation';
import { getEditorUI } from '../store/selectors';
import createNodeView from './NodeView';
var CiteInline = function (props) {
    var _a;
    var view = props.view, node = props.node, open = props.open, edit = props.edit;
    var uid = node.attrs.key;
    var _b = useCitation(uid), loading = _b.loading, inline = _b.inline, json = _b.json, error = _b.error;
    var selectedId = useSelector(function (state) { return getEditorUI(state).viewId; });
    var selected = selectedId === view.dom.id;
    var filler = loading ? 'Loading Citation, 0000' : 'Citation Not Found';
    return (React.createElement("span", { className: classNames({ 'ProseMirror-selectednode': selected && open && edit, error: !loading && error }), title: (_a = json === null || json === void 0 ? void 0 : json.title) !== null && _a !== void 0 ? _a : '', key: uid }, inline || filler));
};
var CiteView = createNodeView(CiteInline, { wrapper: 'span', className: 'citation' });
export default CiteView;
//# sourceMappingURL=CiteView.js.map