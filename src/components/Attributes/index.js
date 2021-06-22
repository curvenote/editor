import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isEqual from 'lodash.isequal';
import { TextField, makeStyles, createStyles, Popover, Paper, Typography, } from '@material-ui/core';
import { schemas } from '@curvenote/schema';
import { closeAttributeEditor, updateNodeAttrs } from '../../store/actions';
import { getEditorUI, getAttributeEditorLocation, showAttributeEditor, getNodeAttrs, getEditorState, getAttributeEditorPos, } from '../../store/selectors';
import { isEditable } from '../../prosemirror/plugins/editable';
var HEIGHT = 300;
var useStyles = makeStyles(function (theme) {
    return createStyles({
        root: {
            backgroundColor: '#fff',
            padding: theme.spacing(1),
            width: 300,
            maxHeight: HEIGHT,
            overflowY: 'scroll',
            overscrollBehavior: 'none',
            '& > *': {
                margin: theme.spacing(1),
                width: 'calc(100% - 15px)',
            },
        },
    });
});
export var NODES_WITH_ATTRS = new Set(Object.keys(schemas.reactiveNodes));
var Attributes = function () {
    var classes = useStyles();
    var dispatch = useDispatch();
    var stateKey = useSelector(function (state) { return getEditorUI(state).stateId; });
    var pos = useSelector(function (state) { return getAttributeEditorPos(state); });
    var show = useSelector(function (state) { return showAttributeEditor(state); });
    var _a = useSelector(function (state) {
        var editorState = getEditorState(state, stateKey).state;
        var blank = { node: null, editing: isEditable(editorState) };
        if (!editorState || !show)
            return blank;
        var potentialNode = editorState.doc.resolve(pos).nodeAfter;
        if (potentialNode == null || !NODES_WITH_ATTRS.has(potentialNode.type.name))
            return blank;
        return { node: potentialNode, editing: blank.editing };
    }, isEqual), node = _a.node, editing = _a.editing;
    var location = useSelector(function (state) { return getAttributeEditorLocation(state); }, isEqual);
    var attrs = useSelector(function (state) { var _a; return (node ? (_a = getNodeAttrs(state, stateKey, pos)) !== null && _a !== void 0 ? _a : {} : {}); }, isEqual);
    var keys = Object.keys(attrs);
    var onChange = useCallback(function (key, value) {
        var _a;
        if (node == null)
            return;
        dispatch(updateNodeAttrs(stateKey, null, { node: node, pos: pos }, (_a = {}, _a[key] = value, _a)));
    }, [dispatch, stateKey, node]);
    var onClose = useCallback(function () { return dispatch(closeAttributeEditor()); }, []);
    if (!editing || !location || node == null || keys.length === 0)
        return null;
    var title = "" + node.type.name[0].toUpperCase() + node.type.name.slice(1) + " Settings";
    return (React.createElement(Popover, { open: show, anchorReference: "anchorPosition", anchorPosition: location, onClose: onClose },
        React.createElement(Paper, null,
            React.createElement("div", { className: classes.root },
                React.createElement(Typography, { variant: "subtitle1" }, title),
                keys.map(function (key) {
                    var value = attrs[key];
                    return (React.createElement(TextField, { label: key, key: key, value: value, onChange: function (event) { return onChange(key, event.target.value); }, onBlur: function (event) { return onChange(key, event.target.value); }, multiline: true }));
                })))));
};
export default Attributes;
//# sourceMappingURL=index.js.map