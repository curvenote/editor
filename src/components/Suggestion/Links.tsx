/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, makeStyles, createStyles } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import { State, Dispatch } from '../../store/types';
import { selectors, actions } from '../../store';
import Suggestion from './Suggestion';
import { LinkResult } from '../../store/suggestion/types';

const useStyles = makeStyles(() => createStyles({
  root: {
    position: 'relative',
    '& div': {
      position: 'absolute',
      padding: '0 3px',
      border: '1px solid #FFF',
      fontFamily: 'system-ui, "Noto Sans"',
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
}));


const LinkSuggestions = () => {
  const dispatch = useDispatch<Dispatch>();

  const suggestions = useSelector(
    (state: State) => selectors.getSuggestion(state), isEqual,
  );
  const { selected, results } = suggestions as { selected: number; results: LinkResult[] };

  const onClick = (index: number) => dispatch(actions.chooseSelection(index));
  const onHover = (index: number) => dispatch(actions.selectSuggestion(index));

  const classes = useStyles();
  return (
    <div>
      {results.length === 0 && (
        <Suggestion
          onClick={() => null}
          onHover={() => null}
          selected={false}
          className={classes.root}
        >
          <Typography variant="subtitle2">
            Start typing to search through your links and citations.
          </Typography>
        </Suggestion>
      )}
      {results.map(((item, index) => (
        <Suggestion
          key={item.uid}
          onClick={() => onClick(index)}
          onHover={() => onHover(index)}
          selected={selected === index}
          className={classes.root}
        >
          <Typography variant="subtitle2">
            {item.title}
          </Typography>
          <Typography variant="caption">
            {item.authors?.join(', ')}
          </Typography>
        </Suggestion>
      )))}
    </div>
  );
};

export default LinkSuggestions;
