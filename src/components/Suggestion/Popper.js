import React, { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper } from '@material-ui/core';
import { selectors } from '../../store';
import useClickOutside from '../hooks/useClickOutside';
import { createPopperLocationCache, registerPopper } from '../InlineActions';
import { closeSuggestion } from '../../store/actions';
import { getSelectedView } from '../../store/selectors';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            minWidth: 300,
            maxWidth: 500,
            maxHeight: 350,
            overflowY: 'auto',
            margin: '10px 0',
        },
    });
});
function Suggestion(props) {
    var _a;
    var children = props.children;
    var open = useSelector(selectors.isSuggestionOpen);
    var classes = useStyles();
    var paperRef = useRef(null);
    var cache = useMemo(createPopperLocationCache, []);
    var dispatch = useDispatch();
    useClickOutside(paperRef, function () {
        dispatch(closeSuggestion());
    });
    var view = useSelector(getSelectedView).view;
    cache.setNode(function () { var _a; return (_a = view === null || view === void 0 ? void 0 : view.dom.querySelector('.autocomplete')) !== null && _a !== void 0 ? _a : null; });
    if (!open || !((_a = cache.getNode()) === null || _a === void 0 ? void 0 : _a.isConnected))
        return null;
    return (React.createElement(Popper, { className: "above-modals", open: open, anchorEl: cache.anchorEl, popperRef: function (pop) { return registerPopper(pop); }, placement: "bottom-start" },
        React.createElement(Paper, { className: classes.root, elevation: 10, ref: paperRef }, children)));
}
export default Suggestion;
//# sourceMappingURL=Popper.js.map