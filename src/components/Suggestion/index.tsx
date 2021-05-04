/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import {
  makeStyles, createStyles, Paper, Popper,
} from '@material-ui/core';
import { State } from '../../store/types';
import EmojiSuggestions from './Emojis';
import CommandSuggestions from './Commands';
import VariableSuggestions from './Variables';
import LinkSuggestions from './Links';
import { SuggestionKind } from '../../store/suggestion/types';
import { selectors } from '../../store';
import { SUGGESTION_ID } from '../../prosemirror/plugins/suggestion';


const useStyles = makeStyles(() => createStyles({
  root: {
    minWidth: 300,
    maxWidth: 500,
    maxHeight: 350,
    overflowY: 'scroll',
    margin: '10px 0',
  },
  aboveModals: {
    zIndex: 1301,
  },
}));


const Suggestion = () => {
  const {
    open, kind, results,
  } = useSelector((state: State) => selectors.getSuggestion(state), isEqual);
  const classes = useStyles();
  if (!open || results.length === 0) return null;

  const anchorEl = document.getElementById(SUGGESTION_ID);
  if (!anchorEl) return null;

  return (
    <Popper className={classes.aboveModals} open={open} anchorEl={anchorEl} placement="bottom-start">
      <Paper
        className={classes.root}
        elevation={10}
      >
        {kind === SuggestionKind.emoji && <EmojiSuggestions />}
        {kind === SuggestionKind.command && <CommandSuggestions />}
        {kind === SuggestionKind.link && <LinkSuggestions />}
        {
          (kind === SuggestionKind.variable || kind === SuggestionKind.display)
          && <VariableSuggestions />
        }
      </Paper>
    </Popper>
  );
};

export default Suggestion;

