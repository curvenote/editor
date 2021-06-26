import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../store/types';
import EmojiSuggestions from './Emojis';
import CommandSuggestions from './Commands';
import VariableSuggestions from './Variables';
import LinkSuggestions from './Links';
import { SuggestionKind } from '../../store/suggestion/types';
import { selectors } from '../../store';

const SuggestionSwitch = () => {
  const kind = useSelector((state: State) => selectors.getSuggestion(state).kind);
  return (
    <>
      {kind === SuggestionKind.emoji && <EmojiSuggestions />}
      {kind === SuggestionKind.command && <CommandSuggestions />}
      {kind === SuggestionKind.link && <LinkSuggestions />}
      {(kind === SuggestionKind.variable || kind === SuggestionKind.display) && (
        <VariableSuggestions />
      )}
    </>
  );
};

export default SuggestionSwitch;
