import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, makeStyles, createStyles } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { selectors, actions } from '../../store';
import Suggestion from './Suggestion';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        position: 'relative',
        '& div': {
            position: 'absolute',
            padding: '0 3px',
            border: '1px solid #FFF',
            fontFamily: 'system-ui, "Noto Sans"',
            fontSize: 12,
            color: '#5f5f5f',
            top: 3,
            right: 3,
            backgroundColor: '#D4D4D4',
            borderRadius: 3,
        },
        '& h6': {
            marginRight: 50,
        },
        '& span': {
            margin: 5,
            marginRight: 50,
        },
    },
}); });
var LinkSuggestions = function () {
    var dispatch = useDispatch();
    var suggestions = useSelector(function (state) { return selectors.getSuggestion(state); }, isEqual);
    var _a = suggestions, selected = _a.selected, results = _a.results;
    var onClick = function (index) { return dispatch(actions.chooseSelection(index)); };
    var onHover = function (index) { return dispatch(actions.selectSuggestion(index)); };
    var classes = useStyles();
    return (React.createElement("div", null,
        results.length === 0 && (React.createElement(Suggestion, { onClick: function () { return null; }, onHover: function () { return null; }, selected: false, className: classes.root },
            React.createElement(Typography, { variant: "subtitle2" }, "Start typing to search through your links and citations."))),
        results.map((function (item, index) {
            var _a;
            return (React.createElement(Suggestion, { key: item.uid, onClick: function () { return onClick(index); }, onHover: function () { return onHover(index); }, selected: selected === index, className: classes.root },
                React.createElement(Typography, { variant: "subtitle2" }, item.title),
                React.createElement(Typography, { variant: "caption" }, (_a = item.authors) === null || _a === void 0 ? void 0 : _a.join(', '))));
        }))));
};
export default LinkSuggestions;
//# sourceMappingURL=Links.js.map