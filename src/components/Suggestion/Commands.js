import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, makeStyles, createStyles } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { selectors, actions } from '../../store';
import Suggestion from './Suggestion';
import Keyboard from '../Keyboard';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        position: 'relative',
        '& div': {
            position: 'absolute',
            top: 3,
            right: 3,
        },
        '& h6': {
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
        item.shortcut && React.createElement("div", null,
            React.createElement(Keyboard, { shortcut: item.shortcut })),
        React.createElement(Typography, { variant: "subtitle1" }, item.title),
        React.createElement(Typography, { variant: "caption" }, item.description))); }))));
};
export default CommandSuggestions;
//# sourceMappingURL=Commands.js.map