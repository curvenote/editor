import React, { useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Menu } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import { CommandNames } from '../../store/suggestion/commands';
import { selectors, actions } from '../../store';
import schema from '../../prosemirror/schema';
import MenuIcon from './Icon';
import { isEditable } from '../../prosemirror/plugins/editable';
import MenuAction from './Action';
import { toggleCitationBrackets } from '../../store/actions/editor';
var useStyles = makeStyles(function (theme) { return createStyles({
    root: {
        width: 'fit-content',
        fontSize: 20,
    },
    pad: {
        margin: theme.spacing(0, 2),
    },
    center: {
        margin: '0 auto',
    },
}); });
var EditorMenu = function (props) {
    var standAlone = props.standAlone, disabled = props.disabled;
    var classes = useStyles();
    var dispatch = useDispatch();
    var _a = React.useState(null), anchorEl = _a[0], setAnchorEl = _a[1];
    var onOpen = useCallback(function (event) { return setAnchorEl(event.currentTarget); }, []);
    var onClose = useCallback(function () { return setAnchorEl(null); }, []);
    var stateId = useSelector(function (state) { return selectors.getEditorUI(state).stateId; });
    var viewId = useSelector(function (state) { return selectors.getEditorUI(state).viewId; });
    var off = useSelector(function (state) {
        var _a;
        return (!isEditable((_a = selectors.getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state));
    });
    off = off || disabled;
    var active = useSelector(function (state) { return selectors.selectionIsMarkedWith(state, stateId, {
        strong: schema.marks.strong,
        em: schema.marks.em,
        sub: schema.marks.subscript,
        sup: schema.marks.superscript,
        strike: schema.marks.strikethrough,
        underline: schema.marks.underline,
        linked: schema.marks.link,
        code: schema.marks.code,
    }); }, isEqual);
    var parents = useSelector(function (state) { return selectors.selectionIsChildOf(state, stateId, {
        ul: schema.nodes.bullet_list,
        ol: schema.nodes.ordered_list,
        math: schema.nodes.math,
        cite_group: schema.nodes.cite_group,
    }); }, isEqual);
    var nodes = useSelector(function (state) { return selectors.selectionIsThisNodeType(state, stateId, {
        cite: schema.nodes.cite,
    }); }, isEqual);
    var toggleMark = function (mark) { return function () { return dispatch(actions.toggleMark(stateId, viewId, mark)); }; };
    var wrapInline = function (node) { return function () { return dispatch(actions.insertInlineNode(node)); }; };
    var command = function (name) { return function () { return dispatch(actions.executeCommand(name, viewId)); }; };
    var toggleBrackets = useCallback(function () { return dispatch(toggleCitationBrackets()); }, []);
    return (React.createElement(Grid, { container: true, alignItems: "center", className: classes.root + " " + (standAlone ? classes.center : classes.pad), wrap: "nowrap" },
        !standAlone && React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "bold", active: active.strong, disabled: off, onClick: toggleMark(schema.marks.strong) }),
        React.createElement(MenuIcon, { kind: "italic", active: active.em, disabled: off, onClick: toggleMark(schema.marks.em) }),
        React.createElement(MenuIcon, { kind: "underline", active: active.underline, disabled: off, onClick: toggleMark(schema.marks.underline) }),
        React.createElement(MenuIcon, { kind: "strikethrough", active: active.strike, disabled: off, onClick: toggleMark(schema.marks.strikethrough) }),
        React.createElement(MenuIcon, { kind: "code", active: active.code, disabled: off, onClick: toggleMark(schema.marks.code) }),
        React.createElement(MenuIcon, { kind: "subscript", active: active.sub, disabled: off, onClick: toggleMark(schema.marks.subscript) }),
        React.createElement(MenuIcon, { kind: "superscript", active: active.sup, disabled: off, onClick: toggleMark(schema.marks.superscript) }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "ul", active: parents.ul, disabled: off, onClick: command(CommandNames.bullet_list) }),
        React.createElement(MenuIcon, { kind: "ol", active: parents.ol, disabled: off, onClick: command(CommandNames.ordered_list) }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "link", active: active.linked, disabled: off, onClick: command(CommandNames.link) }),
        nodes.cite && React.createElement(MenuIcon, { kind: "brackets", active: parents.cite_group, disabled: off, onClick: toggleBrackets }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "more", disabled: off, onClick: onOpen, "aria-controls": "insert-menu" }),
        Boolean(anchorEl) && (React.createElement(Menu, { id: "insert-menu", anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: onClose },
            React.createElement("div", { onClick: function () { return onClose(); } },
                React.createElement(MenuAction, { kind: "math", disabled: off, action: wrapInline(schema.nodes.math), title: "Inline Math" }),
                React.createElement(MenuAction, { kind: "math", disabled: off, action: command(CommandNames.equation), title: "Equation Block" }),
                React.createElement(MenuAction, { kind: "link", disabled: off, action: command(CommandNames.citation), title: "Citation" }),
                React.createElement(MenuAction, { kind: "hr", disabled: off, action: command(CommandNames.horizontal_rule), title: "Divider" }),
                React.createElement(MenuAction, { kind: "code", disabled: off, action: command(CommandNames.code), title: "Code" }),
                React.createElement(MenuAction, { kind: "youtube", disabled: off, action: command(CommandNames.youtube), title: "YouTube Video" }),
                React.createElement(MenuAction, { kind: "video", disabled: off, action: command(CommandNames.vimeo), title: "Vimeo Video" }),
                React.createElement(MenuAction, { kind: "video", disabled: off, action: command(CommandNames.loom), title: "Loom Video" }),
                React.createElement(MenuAction, { kind: "iframe", disabled: off, action: command(CommandNames.miro), title: "Miro Board" }),
                React.createElement(MenuAction, { kind: "iframe", disabled: off, action: command(CommandNames.iframe), title: "Embed an IFrame" }))))));
};
EditorMenu.defaultProps = {
    standAlone: false,
    disabled: false,
};
export default EditorMenu;
//# sourceMappingURL=index.js.map