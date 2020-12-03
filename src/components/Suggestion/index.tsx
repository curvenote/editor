/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import { State } from '../../store/types';
import EmojiSuggestions from './Emojis';
import CommandSuggestions from './Commands';
import VariableSuggestions from './Variables';
import { SuggestionKind } from '../../store/suggestion/types';
import { selectors } from '../../store';


const Suggestion = () => {
  const {
    open, kind, location, results,
  } = useSelector((state: State) => selectors.getSuggestion(state), isEqual);
  if (!open || results.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: location?.bottom,
      left: location?.left,
      minWidth: 300,
      maxHeight: 350,
      overflowY: 'scroll',
      backgroundColor: 'rgba(250, 250, 250, 0.9)',
      boxShadow: '0 0 7px rgba(0, 0, 0, 0.1)',
      border: '1px solid silver',
      backdropFilter: 'blur(2px)',
    }}
    >
      {kind === SuggestionKind.emoji && <EmojiSuggestions />}
      {kind === SuggestionKind.command && <CommandSuggestions />}
      {
        (kind === SuggestionKind.variable || kind === SuggestionKind.display)
        && <VariableSuggestions />
      }
    </div>
  );
};

export default Suggestion;

