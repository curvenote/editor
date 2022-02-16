import React, { useCallback, useEffect, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import scrollIntoView from 'scroll-into-view-if-needed';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { isSuggestionSelected } from '../../store/selectors';
import { chooseSelection, selectSuggestion } from '../../store/actions';
import { positionPopper } from '../InlineActions/utils';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            padding: 10,
            cursor: 'pointer',
            clear: 'both',
        },
        selected: {
            backgroundColor: '#e8e8e8',
        },
    });
});
function Suggestion(props) {
    var _a;
    var index = props.index, children = props.children, className = props.className;
    positionPopper();
    var classes = useStyles();
    var ref = useRef(null);
    var dispatch = useDispatch();
    var selected = useSelector(function (state) { return isSuggestionSelected(state, index); });
    var onClick = useCallback(function () { return dispatch(chooseSelection(index)); }, [index]);
    var onHover = useCallback(function () { return dispatch(selectSuggestion(index)); }, [index]);
    useEffect(function () {
        var _a;
        if (ref.current == null || !selected)
            return;
        scrollIntoView(ref.current, {
            behavior: 'smooth',
            scrollMode: 'if-needed',
            boundary: (_a = ref.current.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement,
        });
    }, [selected]);
    return (React.createElement("div", { className: classNames(classes.root, (_a = {},
            _a[className !== null && className !== void 0 ? className : ''] = className,
            _a[classes.selected] = selected,
            _a)), onClick: onClick, onMouseEnter: onHover, ref: ref }, children));
}
export default Suggestion;
//# sourceMappingURL=Suggestion.js.map