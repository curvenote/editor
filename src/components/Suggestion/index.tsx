/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import { makeStyles, createStyles } from '@material-ui/core';
import { State } from '../../store/types';
import EmojiSuggestions from './Emojis';
import CommandSuggestions from './Commands';
import VariableSuggestions from './Variables';
import LinkSuggestions from './Links';
import { SuggestionKind } from '../../store/suggestion/types';
import { selectors } from '../../store';


const useStyles = makeStyles(() => createStyles({
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
}));


const Suggestion = () => {
  const {
    open, kind, location, results,
  } = useSelector((state: State) => selectors.getSuggestion(state), isEqual);
  const classes = useStyles();
  if (!open || results.length === 0) return null;

  return (
    <div
      className={classes.root}
      style={{
        top: location?.bottom,
        left: location?.left,
      }}
    >
      {kind === SuggestionKind.emoji && <EmojiSuggestions />}
      {kind === SuggestionKind.command && <CommandSuggestions />}
      {kind === SuggestionKind.link && <LinkSuggestions />}
      {
        (kind === SuggestionKind.variable || kind === SuggestionKind.display)
        && <VariableSuggestions />
      }
    </div>
  );
};

export default Suggestion;

