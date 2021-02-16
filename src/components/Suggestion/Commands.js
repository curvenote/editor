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
var CommandSuggestions = function () {
    var dispatch = useDispatch();
    var suggestions = useSelector(function (state) { return selectors.getSuggestion(state); }, isEqual);
    var _a = suggestions, selected = _a.selected, results = _a.results;
    var onClick = function (index) { return dispatch(actions.chooseSelection(index)); };
    var onHover = function (index) { return dispatch(actions.selectSuggestion(index)); };
    var classes = useStyles();
    return (React.createElement("div", null, results.map((function (item, index) { return (React.createElement(Suggestion, { key: item.name, onClick: function () { return onClick(index); }, onHover: function () { return onHover(index); }, selected: selected === index, className: classes.root },
        item.shortcut && React.createElement("div", null, item.shortcut),
        React.createElement(Typography, { variant: "subtitle1" }, item.title),
        React.createElement(Typography, { variant: "caption" }, item.description))); }))));
};
export default CommandSuggestions;
//# sourceMappingURL=Commands.js.map