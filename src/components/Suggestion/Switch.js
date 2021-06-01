import React from 'react';
import { useSelector } from 'react-redux';
import EmojiSuggestions from './Emojis';
import CommandSuggestions from './Commands';
import VariableSuggestions from './Variables';
import LinkSuggestions from './Links';
import { SuggestionKind } from '../../store/suggestion/types';
import { selectors } from '../../store';
var SuggestionSwitch = function () {
    var kind = useSelector(function (state) { return selectors.getSuggestion(state).kind; });
    return (React.createElement(React.Fragment, null,
        kind === SuggestionKind.emoji && React.createElement(EmojiSuggestions, null),
        kind === SuggestionKind.command && React.createElement(CommandSuggestions, null),
        kind === SuggestionKind.link && React.createElement(LinkSuggestions, null),
        (kind === SuggestionKind.variable || kind === SuggestionKind.display)
            && React.createElement(VariableSuggestions, null)));
};
export default SuggestionSwitch;
//# sourceMappingURL=Switch.js.map