import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, makeStyles, createStyles } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { State } from '../../store/types';
import { selectors } from '../../store';
import Suggestion from './Suggestion';
import { CommandResult } from '../../store/suggestion/commands';
import Keyboard from '../Keyboard';
import { positionPopper } from '../InlineActions/utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative',
      '& div': {
        position: 'absolute',
        top: 3,
        right: 3,
      },
      '& h6': {
        marginRight: 50,
      },
    },
    none: {
      margin: 10,
    },
  }),
);

const CommandSuggestions: React.FC = () => {
  const results = useSelector(
    (state: State) => selectors.getSuggestionResults<CommandResult>(state),
    isEqual,
  );
  positionPopper();
  const classes = useStyles();
  if (results.length === 0) {
    return (
      <Typography variant="subtitle2" className={classes.none}>
        No command found, try a different search!
      </Typography>
    );
  }
  return (
    <div>
      {results.map((item, index) => (
        <Suggestion key={item.name} index={index} className={classes.root}>
          {item.shortcut && (
            <div>
              <Keyboard shortcut={item.shortcut} />
            </div>
          )}
          <Typography variant="subtitle1">{item.title}</Typography>
          <Typography variant="caption">{item.description}</Typography>
        </Suggestion>
      ))}
    </div>
  );
};

export default CommandSuggestions;
