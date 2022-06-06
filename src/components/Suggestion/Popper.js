import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, createStyles, Paper, Popper } from '@material-ui/core';
import { selectors } from '../../store';
import useClickOutside from '../hooks/useClickOutside';
import { usePopper } from '../InlineActions';
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
    var children = props.children;
    var open = useSelector(selectors.isSuggestionOpen);
    var classes = useStyles();
    var paperRef = useRef(null);
    var dispatch = useDispatch();
    useClickOutside(paperRef, function () {
        dispatch(closeSuggestion());
    });
    var view = useSelector(getSelectedView).view;
    var autocomplete = view === null || view === void 0 ? void 0 : view.dom.querySelector('.autocomplete');
    var popperRef = usePopper(autocomplete)[0];
    if (!open || !(autocomplete === null || autocomplete === void 0 ? void 0 : autocomplete.isConnected))
        return null;
    return (React.createElement(Popper, { className: "above-modals", open: open, anchorEl: autocomplete, popperRef: popperRef, placement: "bottom-start" },
        React.createElement(Paper, { className: classes.root, elevation: 10, ref: paperRef }, children)));
}
export default Suggestion;
//# sourceMappingURL=Popper.js.map