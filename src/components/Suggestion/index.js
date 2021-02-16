import React from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import { makeStyles, createStyles } from '@material-ui/core';
import EmojiSuggestions from './Emojis';
import CommandSuggestions from './Commands';
import VariableSuggestions from './Variables';
import LinkSuggestions from './Links';
import { SuggestionKind } from '../../store/suggestion/types';
import { selectors } from '../../store';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        position: 'fixed',
        minWidth: 300,
        maxWidth: 500,
        maxHeight: 350,
        overflowY: 'scroll',
        backgroundColor: 'rgba(250, 250, 250, 0.9)',
        boxShadow: '0 0 7px rgba(0, 0, 0, 0.1)',
        border: '1px solid silver',
        backdropFilter: 'blur(2px)',
        zIndex: 50,
    },
}); });
var Suggestion = function () {
    var _a = useSelector(function (state) { return selectors.getSuggestion(state); }, isEqual), open = _a.open, kind = _a.kind, location = _a.location, results = _a.results;
    var classes = useStyles();
    if (!open || results.length === 0)
        return null;
    return (React.createElement("div", { className: classes.root, style: {
            top: location === null || location === void 0 ? void 0 : location.bottom,
            left: location === null || location === void 0 ? void 0 : location.left,
        } },
        kind === SuggestionKind.emoji && React.createElement(EmojiSuggestions, null),
        kind === SuggestionKind.command && React.createElement(CommandSuggestions, null),
        kind === SuggestionKind.link && React.createElement(LinkSuggestions, null),
        (kind === SuggestionKind.variable || kind === SuggestionKind.display)
            && React.createElement(VariableSuggestions, null)));
};
export default Suggestion;
//# sourceMappingURL=index.js.map