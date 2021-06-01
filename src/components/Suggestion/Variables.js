import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, makeStyles, createStyles } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { selectors } from '../../store';
import Suggestion from './Suggestion';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        position: 'relative',
        '& div': {
            position: 'absolute',
            padding: '0 3px',
            border: '1px solid #FFF',
            fontFamily: 'system- ui, "Noto Sans"',
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
var VariableSuggestions = function () {
    var results = useSelector(function (state) { return selectors.getSuggestionResults(state); }, isEqual);
    var classes = useStyles();
    return (React.createElement("div", null, results.map((function (item, index) { return (React.createElement(Suggestion, { key: item.id, index: index, className: classes.root },
        item.current !== undefined && React.createElement("div", null, String(item.current)),
        React.createElement(Typography, { variant: "subtitle1" }, item.name),
        React.createElement(Typography, { variant: "caption" }, item.description))); }))));
};
export default VariableSuggestions;
//# sourceMappingURL=Variables.js.map