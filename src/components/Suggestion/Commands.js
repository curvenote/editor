import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, makeStyles, createStyles } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { selectors } from '../../store';
import Suggestion from './Suggestion';
import Keyboard from '../Keyboard';
import { positionPopper } from '../InlineActions/utils';
var useStyles = makeStyles(function () {
    return createStyles({
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
        none: {
            margin: 10,
        },
    });
});
var CommandSuggestions = function () {
    var results = useSelector(function (state) { return selectors.getSuggestionResults(state); }, isEqual);
    positionPopper();
    var classes = useStyles();
    if (results.length === 0) {
        return (React.createElement(Typography, { variant: "subtitle2", className: classes.none }, "No command found, try a different search!"));
    }
    return (React.createElement("div", null, results.map(function (item, index) { return (React.createElement(Suggestion, { key: item.name, index: index, className: classes.root },
        item.shortcut && (React.createElement("div", null,
            React.createElement(Keyboard, { shortcut: item.shortcut }))),
        React.createElement(Typography, { variant: "subtitle1" }, item.title),
        React.createElement(Typography, { variant: "caption" }, item.description))); })));
};
export default CommandSuggestions;
//# sourceMappingURL=Commands.js.map