import React from 'react';
import { FormControl, Select as MuiSelect, MenuItem, styled, makeStyles, createStyles, Grid, } from '@material-ui/core';
import { findParentNode, replaceParentNodeOfType } from 'prosemirror-utils1';
import { CaptionKind, nodeNames } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { SUPPORTED_LANGUAGES } from '../../views/types';
import MenuIcon from '../Menu/Icon';
import { applyProsemirrorTransaction, createFigure, createFigureCaption, deleteNode, } from '../../store/actions';
import { updateNodeAttrs } from '../../store/actions/editor';
import { getEditorState } from '../../store/state/selectors';
import { getFigure } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            width: 'fit-content',
            paddingLeft: '0.5rem',
            fontSize: 20,
            flexWrap: 'nowrap',
        },
        menulist: {
            maxHeight: '15rem',
        },
        dropdownContainer: {
            width: 100,
        },
        popover: {
            overflow: 'visible',
        },
    });
});
var Select = styled(MuiSelect)(function () { return ({
    root: {
        zIndex: 1302,
    },
    '& .MuiSelect-select': {
        padding: 2,
    },
}); });
function LanguageSeletionDropdown(_a) {
    var value = _a.value, onChanged = _a.onChanged;
    var classes = useStyles();
    return (React.createElement(FormControl, { fullWidth: true },
        React.createElement(Select, { disableUnderline: true, onChange: function (e) {
                onChanged(e.target.value);
            }, value: value || SUPPORTED_LANGUAGES[0].name, MenuProps: {
                className: 'above-modals',
                MenuListProps: {
                    className: classes.menulist,
                },
            } }, SUPPORTED_LANGUAGES.map(function (_a) {
            var name = _a.name, label = _a.label;
            return (React.createElement(MenuItem, { key: name, value: name }, label));
        }))));
}
function CodeActions(props) {
    var _a, _b;
    var stateId = props.stateId, viewId = props.viewId;
    var classes = useStyles();
    var dispatch = useDispatch();
    var editorState = useSelector(function (state) { var _a; return (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    var _c = getFigure(editorState), figure = _c.figure, figcaption = _c.figcaption;
    if (figcaption && figure)
        figcaption.pos = figure.pos + 1 + figcaption.pos;
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    var parent = selection && findParentNode(function (n) { return n.type.name === nodeNames.code_block; })(selection);
    var node;
    var pos;
    var end = -1;
    if (parent) {
        node = parent.node;
        pos = parent.pos;
        end = parent.start + parent.node.nodeSize;
    }
    else {
        node = getNodeFromSelection(selection);
        if (!node || !selection) {
            return null;
        }
        pos = selection.from;
        end = selection.$from.start() + node.nodeSize;
    }
    if (!editorState || !node || pos == null)
        return null;
    var onDelete = function () { return dispatch(deleteNode(stateId, viewId, { node: node, pos: pos })); };
    var onCaption = function () {
        if (!figure) {
            var wrapped = createFigure(editorState.schema, node, true, { align: 'left' });
            var tr = replaceParentNodeOfType(editorState.schema.nodes[nodeNames.code_block], wrapped)(editorState.tr);
            dispatch(applyProsemirrorTransaction(stateId, viewId, tr, true));
            return;
        }
        if (figcaption) {
            var tr = editorState.tr
                .setSelection(NodeSelection.create(editorState.doc, figcaption.pos))
                .deleteSelection();
            dispatch(applyProsemirrorTransaction(stateId, viewId, tr, true));
        }
        else {
            var caption = createFigureCaption(editorState.schema, CaptionKind.code);
            var tr = editorState.tr.insert(end - 1, caption);
            var selected = tr.setSelection(TextSelection.create(tr.doc, end));
            dispatch(applyProsemirrorTransaction(stateId, viewId, selected, true));
        }
    };
    var numbered = (_b = (_a = figure === null || figure === void 0 ? void 0 : figure.node.attrs) === null || _a === void 0 ? void 0 : _a.numbered) !== null && _b !== void 0 ? _b : false;
    var onNumbered = function () {
        if (!figure || !figcaption)
            return;
        dispatch(updateNodeAttrs(stateId, viewId, figure, { numbered: !numbered }));
        dispatch(updateNodeAttrs(stateId, viewId, figcaption, {}, 'inside'));
    };
    var hasFigure = !!editorState.schema.nodes.figure;
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.root },
        React.createElement("div", { className: classes.dropdownContainer },
            React.createElement(LanguageSeletionDropdown, { value: node.attrs.language, onChanged: function (language) {
                    dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { language: language }, false));
                } })),
        React.createElement(MenuIcon, { kind: "lineNumbers", onClick: function () {
                dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { linenumbers: !node.attrs.linenumbers }, false));
            }, active: node.attrs.linenumbers }),
        hasFigure && (React.createElement(React.Fragment, null,
            React.createElement(MenuIcon, { kind: "divider" }),
            React.createElement(MenuIcon, { kind: "caption", active: Boolean(figcaption), onClick: onCaption }))),
        hasFigure && figcaption && (React.createElement(MenuIcon, { kind: "numbered", active: numbered, onClick: onNumbered })),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
}
export default CodeActions;
//# sourceMappingURL=CodeActions.js.map