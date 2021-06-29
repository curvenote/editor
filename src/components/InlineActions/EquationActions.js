import React from 'react';
import { makeStyles, createStyles, Grid } from '@material-ui/core';
import { schemas } from '@curvenote/schema';
import { findParentNode } from 'prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { updateNodeAttrs } from '../../store/actions';
import { getEditorState } from '../../store/selectors';
import { positionPopper } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            width: 'fit-content',
            fontSize: 20,
            flexWrap: 'nowrap',
        },
    });
});
var EquationActions = function (props) {
    var _a, _b, _c;
    var stateId = props.stateId, viewId = props.viewId;
    var classes = useStyles();
    var dispatch = useDispatch();
    var state = useSelector(function (s) { var _a; return (_a = getEditorState(s, stateId)) === null || _a === void 0 ? void 0 : _a.state; });
    var parent = (state === null || state === void 0 ? void 0 : state.selection) &&
        findParentNode(function (n) { return n.type.name === schemas.nodeNames.heading; })(state === null || state === void 0 ? void 0 : state.selection);
    var node = (_a = parent === null || parent === void 0 ? void 0 : parent.node) !== null && _a !== void 0 ? _a : getNodeFromSelection(state === null || state === void 0 ? void 0 : state.selection);
    var pos = (_b = parent === null || parent === void 0 ? void 0 : parent.pos) !== null && _b !== void 0 ? _b : (_c = state === null || state === void 0 ? void 0 : state.selection) === null || _c === void 0 ? void 0 : _c.from;
    if (!node || pos == null)
        return null;
    var numbered = node.attrs.numbered;
    var onNumbered = function () {
        return dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: pos }, { numbered: !numbered }, false));
    };
    positionPopper();
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "numbered", active: numbered, onClick: onNumbered })));
};
export default EquationActions;
//# sourceMappingURL=EquationActions.js.map