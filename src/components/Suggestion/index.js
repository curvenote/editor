import React from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import { makeStyles, createStyles, Paper, Popper, } from '@material-ui/core';
import EmojiSuggestions from './Emojis';
import CommandSuggestions from './Commands';
import VariableSuggestions from './Variables';
import LinkSuggestions from './Links';
import { SuggestionKind } from '../../store/suggestion/types';
import { selectors } from '../../store';
import { SUGGESTION_ID } from '../../prosemirror/plugins/suggestion';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        minWidth: 300,
        maxWidth: 500,
        maxHeight: 350,
        overflowY: 'scroll',
        zIndex: 50,
        margin: '10px 0',
    },
}); });
var Suggestion = function () {
    var _a = useSelector(function (state) { return selectors.getSuggestion(state); }, isEqual), open = _a.open, kind = _a.kind, results = _a.results;
    var classes = useStyles();
    if (!open || results.length === 0)
        return null;
    var anchorEl = document.getElementById(SUGGESTION_ID);
    if (!anchorEl)
        return null;
    return (React.createElement(Popper, { open: open, anchorEl: anchorEl, placement: "bottom-start" },
        React.createElement(Paper, { className: classes.root, elevation: 10 },
            kind === SuggestionKind.emoji && React.createElement(EmojiSuggestions, null),
            kind === SuggestionKind.command && React.createElement(CommandSuggestions, null),
            kind === SuggestionKind.link && React.createElement(LinkSuggestions, null),
            (kind === SuggestionKind.variable || kind === SuggestionKind.display)
                && React.createElement(VariableSuggestions, null))));
};
export default Suggestion;
//# sourceMappingURL=index.js.map