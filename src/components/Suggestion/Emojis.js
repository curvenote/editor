import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Typography } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { selectors } from '../../store';
import Suggestion from './Suggestion';
import { positionPopper } from '../InlineActions/utils';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            '& span': {
                fontFamily: "'Noto Serif', serif",
                margin: 5,
                marginRight: 15,
            },
        },
        none: {
            margin: 10,
        },
    });
});
var EmojiSuggestions = function () {
    var results = useSelector(function (state) { return selectors.getSuggestionResults(state); }, isEqual);
    positionPopper();
    var classes = useStyles();
    if (results.length === 0) {
        return (React.createElement(Typography, { variant: "subtitle2", className: classes.none }, "No emoji found, try a different search!"));
    }
    return (React.createElement("div", null, results.map(function (item, index) { return (React.createElement(Suggestion, { key: item.c, index: index, className: classes.root },
        React.createElement(Typography, null,
            React.createElement("span", null, item.c),
            item.n))); })));
};
export default EmojiSuggestions;
//# sourceMappingURL=Emojis.js.map