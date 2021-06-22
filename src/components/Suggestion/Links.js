import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { selectors } from '../../store';
import Suggestion from './Suggestion';
import { positionPopper } from '../InlineActions/utils';
var LinkSuggestions = function () {
    var results = useSelector(function (state) { return selectors.getSuggestionResults(state); }, isEqual);
    positionPopper();
    if (results.length === 0) {
        return (React.createElement(Suggestion, { index: 0 },
            React.createElement(Typography, { variant: "subtitle2" }, "Start typing to search through your links and citations.")));
    }
    return (React.createElement("div", null, results.map(function (item, index) { return (React.createElement(Suggestion, { key: item.uid, index: index },
        React.createElement(Typography, { variant: "subtitle2" }, item === null || item === void 0 ? void 0 : item.content),
        React.createElement(Typography, { variant: "caption" }, (item === null || item === void 0 ? void 0 : item.title) || item.uid))); })));
};
export default LinkSuggestions;
//# sourceMappingURL=Links.js.map