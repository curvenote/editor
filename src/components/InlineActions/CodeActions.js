import React from 'react';
import { FormControl, Select as MuiSelect, MenuItem, styled, makeStyles, createStyles, Grid, } from '@material-ui/core';
import { findParentNode } from 'prosemirror-utils';
import { nodeNames } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import { SUPPORTED_LANGUAGES } from '../../views/types';
import MenuIcon from '../Menu/Icon';
import { deleteNode } from '../../store/actions';
import { updateNodeAttrs } from '../../store/actions/editor';
import { getEditorState } from '../../store/state/selectors';
import { positionPopper } from './utils';
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
        React.createElement(Select, { onChange: function (e) {
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
var CodeActions = function (props) {
    var _a, _b;
    var stateId = props.stateId, viewId = props.viewId;
    var classes = useStyles();
    var dispatch = useDispatch();
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    var parent = selection && findParentNode(function (n) { return n.type.name === nodeNames.code_block; })(selection);
    var node = (_a = parent === null || parent === void 0 ? void 0 : parent.node) !== null && _a !== void 0 ? _a : getNodeFromSelection(selection);
    var pos = (_b = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _b !== void 0 ? _b : selection === null || selection === void 0 ? void 0 : selection.from;
    if (!node || pos == null)
        return null;
    positionPopper();
    var onDelete = function () { return dispatch(deleteNode(stateId, viewId, { node: node, pos: pos })); };
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "center", className: classes.root },
        React.createElement("div", { className: classes.dropdownContainer },
            React.createElement(LanguageSeletionDropdown, { value: node.attrs.language, onChanged: function (language) {
                    dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { language: language }, false));
                } })),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "remove", onClick: onDelete, dangerous: true })));
};
export default CodeActions;
//# sourceMappingURL=CodeActions.js.map