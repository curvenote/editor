import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { useCitation } from '../../../components/Citation';
import { getEditorUI } from '../../../store/selectors';
var CiteInline = function (props) {
    var _a;
    var viewId = props.viewId, open = props.open, uid = props.uid;
    var _b = useCitation(uid), inline = _b.inline, json = _b.json, error = _b.error;
    var selectedId = useSelector(function (state) { return getEditorUI(state).viewId; });
    var selected = selectedId === viewId;
    return (React.createElement("span", { className: classNames({ 'ProseMirror-selectednode': open && selected, error: error }), title: (_a = json === null || json === void 0 ? void 0 : json.title) !== null && _a !== void 0 ? _a : '', key: uid }, inline || 'Citation Not Found'));
};
export default CiteInline;
//# sourceMappingURL=CiteInline.js.map