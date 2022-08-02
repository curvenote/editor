import React, { useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Menu } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { CommandNames } from '../../store/suggestion/commands';
import { selectors, actions } from '../../store';
import MenuIcon from './Icon';
import { isEditable } from '../../prosemirror/plugins/editable';
import MenuAction from './Action';
import { toggleCitationBrackets } from '../../store/actions/editor';
var useStyles = makeStyles(function (theme) {
    return createStyles({
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
    });
});
function TableMenu(_a) {
    var onClose = _a.onClose, anchor = _a.anchor, isOpen = _a.isOpen, command = _a.command;
    if (!isOpen)
        return null;
    function item(title, action) {
        return (React.createElement(MenuAction, { key: action, title: title, action: function () {
                command(action);
            } }));
    }
    var tableMenu = [
        item('Insert column before', CommandNames.add_column_before),
        item('Insert column after', CommandNames.add_column_after),
        item('Delete column', CommandNames.delete_column),
        item('Insert row before', CommandNames.add_row_before),
        item('Insert row after', CommandNames.add_row_after),
        item('Delete row', CommandNames.delete_row),
        item('Delete table', CommandNames.delete_table),
        item('Merge cells', CommandNames.merge_cells),
        item('Split cell', CommandNames.split_cell),
        item('Toggle header column', CommandNames.toggle_header_column),
        item('Toggle header row', CommandNames.toggle_header_row),
        item('Toggle header cells', CommandNames.toggle_header_cell),
    ];
    return (React.createElement(Menu, { id: "table-menu", anchorEl: anchor, keepMounted: true, open: Boolean(anchor), onClose: onClose },
        React.createElement("div", { onClick: function () { return onClose(); } }, tableMenu)));
}
function EditorMenu(props) {
    var standAlone = props.standAlone, disabled = props.disabled;
    var classes = useStyles();
    var dispatch = useDispatch();
    var _a = React.useState(null), anchorEl = _a[0], setAnchorEl = _a[1];
    var _b = React.useState(null), tableAnchor = _b[0], setTableAnchor = _b[1];
    var _c = React.useState(false), isTableMenuOpen = _c[0], setIsTableMenuOpen = _c[1];
    var onOpen = useCallback(function (event) { return setAnchorEl(event.currentTarget); }, []);
    var onClose = useCallback(function () { return setAnchorEl(null); }, []);
    var stateId = useSelector(function (state) { return selectors.getEditorUI(state).stateId; });
    var viewId = useSelector(function (state) { return selectors.getEditorUI(state).viewId; });
    var off = useSelector(function (state) { var _a; return !isEditable((_a = selectors.getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state); });
    var schema = useSelector(function (state) { var _a, _b; return (_b = (_a = selectors.getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.schema; });
    off = off || disabled;
    var active = useSelector(function (state) {
        return selectors.selectionIsMarkedWith(state, stateId, {
            strong: schema === null || schema === void 0 ? void 0 : schema.marks.strong,
            em: schema === null || schema === void 0 ? void 0 : schema.marks.em,
            sub: schema === null || schema === void 0 ? void 0 : schema.marks.subscript,
            sup: schema === null || schema === void 0 ? void 0 : schema.marks.superscript,
            strike: schema === null || schema === void 0 ? void 0 : schema.marks.strikethrough,
            underline: schema === null || schema === void 0 ? void 0 : schema.marks.underline,
            linked: schema === null || schema === void 0 ? void 0 : schema.marks.link,
            code: schema === null || schema === void 0 ? void 0 : schema.marks.code,
        });
    });
    var parents = useSelector(function (state) {
        return selectors.selectionIsChildOf(state, stateId, {
            ul: schema === null || schema === void 0 ? void 0 : schema.nodes.bullet_list,
            ol: schema === null || schema === void 0 ? void 0 : schema.nodes.ordered_list,
            table: schema === null || schema === void 0 ? void 0 : schema.nodes.table,
            math: schema === null || schema === void 0 ? void 0 : schema.nodes.math,
            cite_group: schema === null || schema === void 0 ? void 0 : schema.nodes.cite_group,
        });
    });
    var nodes = useSelector(function (state) {
        return selectors.selectionIsThisNodeType(state, stateId, {
            cite: schema === null || schema === void 0 ? void 0 : schema.nodes.cite,
        });
    });
    var toggleMark = useCallback(function (mark) { return dispatch(actions.toggleMark(stateId, viewId, mark)); }, [stateId, viewId]);
    var wrapInline = function (node) { return dispatch(actions.insertInlineNode(node)); };
    var command = useCallback(function (name) { return dispatch(actions.executeCommand(name, viewId)); }, [stateId, viewId]);
    var toggleBrackets = useCallback(function () { return dispatch(toggleCitationBrackets()); }, []);
    var clickBold = useCallback(function () { return toggleMark(schema === null || schema === void 0 ? void 0 : schema.marks.strong); }, [toggleMark]);
    var clickItalic = useCallback(function () { return toggleMark(schema === null || schema === void 0 ? void 0 : schema.marks.em); }, [toggleMark]);
    var clickUnderline = useCallback(function () { return toggleMark(schema === null || schema === void 0 ? void 0 : schema.marks.underline); }, [toggleMark]);
    var clickStrike = useCallback(function () { return toggleMark(schema === null || schema === void 0 ? void 0 : schema.marks.strikethrough); }, [toggleMark]);
    var clickCode = useCallback(function () { return toggleMark(schema === null || schema === void 0 ? void 0 : schema.marks.code); }, [toggleMark]);
    var clickSub = useCallback(function () { return toggleMark(schema === null || schema === void 0 ? void 0 : schema.marks.subscript); }, [toggleMark]);
    var clickSuper = useCallback(function () { return toggleMark(schema === null || schema === void 0 ? void 0 : schema.marks.superscript); }, [toggleMark]);
    var clickFootnote = useCallback(function () { return command(CommandNames.footnote); }, [command]);
    var clickUl = useCallback(function () { return command(CommandNames.bullet_list); }, [command]);
    var clickGrid = useCallback(function () { return command(CommandNames.insert_table); }, [command]);
    var clickOl = useCallback(function () { return command(CommandNames.ordered_list); }, [command]);
    var clickLink = useCallback(function () { return command(CommandNames.link); }, [command]);
    var clickMath = useCallback(function () { return wrapInline(schema === null || schema === void 0 ? void 0 : schema.nodes.math); }, [command]);
    var clickEquation = useCallback(function () { return command(CommandNames.equation); }, [command]);
    var clickImage = useCallback(function () { return command(CommandNames.image); }, [command]);
    var clickCite = useCallback(function () { return command(CommandNames.citation); }, [command]);
    var clickHr = useCallback(function () { return command(CommandNames.horizontal_rule); }, [command]);
    var clickCodeBlk = useCallback(function () { return command(CommandNames.code); }, [command]);
    var clickYoutube = useCallback(function () { return command(CommandNames.youtube); }, [command]);
    var clickVimeo = useCallback(function () { return command(CommandNames.vimeo); }, [command]);
    var clickLoom = useCallback(function () { return command(CommandNames.loom); }, [command]);
    var clickMiro = useCallback(function () { return command(CommandNames.miro); }, [command]);
    var clickIframe = useCallback(function () { return command(CommandNames.iframe); }, [command]);
    return (React.createElement(Grid, { container: true, alignItems: "center", className: "".concat(classes.root, " ").concat(standAlone ? classes.center : classes.pad), wrap: "nowrap" },
        !standAlone && React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "bold", active: active.strong, disabled: off, onClick: clickBold }),
        React.createElement(MenuIcon, { kind: "italic", active: active.em, disabled: off, onClick: clickItalic }),
        React.createElement(MenuIcon, { kind: "underline", active: active.underline, disabled: off, onClick: clickUnderline }),
        React.createElement(MenuIcon, { kind: "strikethrough", active: active.strike, disabled: off, onClick: clickStrike }),
        React.createElement(MenuIcon, { kind: "code", active: active.code, disabled: off, onClick: clickCode }),
        React.createElement(MenuIcon, { kind: "subscript", active: active.sub, disabled: off, onClick: clickSub }),
        React.createElement(MenuIcon, { kind: "superscript", active: active.sup, disabled: off, onClick: clickSuper }),
        parents.table && (React.createElement(React.Fragment, null,
            React.createElement(MenuIcon, { kind: "divider" }),
            React.createElement(MenuIcon, { kind: "table", active: parents.ul, disabled: off, onClick: function (e) {
                    setIsTableMenuOpen(true);
                    setTableAnchor(e.currentTarget);
                } }))),
        React.createElement(TableMenu, { anchor: tableAnchor, onClose: function () {
                setIsTableMenuOpen(false);
            }, isOpen: isTableMenuOpen, command: command }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "ul", active: parents.ul, disabled: off || !(schema === null || schema === void 0 ? void 0 : schema.nodes.bullet_list), onClick: clickUl }),
        React.createElement(MenuIcon, { kind: "ol", active: parents.ol, disabled: off || !(schema === null || schema === void 0 ? void 0 : schema.nodes.ordered_list), onClick: clickOl }),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "link", active: active.linked, disabled: off, onClick: clickLink }),
        nodes.cite && (React.createElement(MenuIcon, { kind: "brackets", active: parents.cite_group, disabled: off, onClick: toggleBrackets })),
        React.createElement(MenuIcon, { kind: "divider" }),
        React.createElement(MenuIcon, { kind: "more", disabled: off, onClick: onOpen, "aria-controls": "insert-menu" }),
        Boolean(anchorEl) && (React.createElement(Menu, { id: "insert-menu", anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: onClose },
            React.createElement("div", { onClick: function () { return onClose(); } },
                (schema === null || schema === void 0 ? void 0 : schema.nodes.math) && (React.createElement(MenuAction, { kind: "math", disabled: off, action: clickMath, title: "Inline Math" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.equation) && (React.createElement(MenuAction, { kind: "math", disabled: off, action: clickEquation, title: "Equation Block" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.image) && (React.createElement(MenuAction, { kind: "image", disabled: off, action: clickImage, title: "Image" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.footnote) && (React.createElement(MenuAction, { title: "Footnote", kind: "footnote", disabled: off, action: clickFootnote })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.table) && (React.createElement(MenuAction, { title: "Table", kind: "table", disabled: off, action: clickGrid })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.cite) && (React.createElement(MenuAction, { kind: "link", disabled: off, action: clickCite, title: "Citation" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.horizontal_rule) && (React.createElement(MenuAction, { kind: "hr", disabled: off, action: clickHr, title: "Divider" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.code_block) && (React.createElement(MenuAction, { kind: "code", disabled: off, action: clickCodeBlk, title: "Code" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.iframe) && (React.createElement(MenuAction, { kind: "youtube", disabled: off, action: clickYoutube, title: "YouTube Video" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.iframe) && (React.createElement(MenuAction, { kind: "video", disabled: off, action: clickVimeo, title: "Vimeo Video" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.iframe) && (React.createElement(MenuAction, { kind: "video", disabled: off, action: clickLoom, title: "Loom Video" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.iframe) && (React.createElement(MenuAction, { kind: "iframe", disabled: off, action: clickMiro, title: "Miro Board" })),
                (schema === null || schema === void 0 ? void 0 : schema.nodes.iframe) && (React.createElement(MenuAction, { kind: "iframe", disabled: off, action: clickIframe, title: "Embed an IFrame" })))))));
}
EditorMenu.defaultProps = {
    standAlone: false,
    disabled: false,
};
export default EditorMenu;
//# sourceMappingURL=index.js.map