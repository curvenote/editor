/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { makeStyles, createStyles, Typography } from '@material-ui/core';
import { State, Dispatch } from '../../store/types';
import { selectors, actions } from '../../store';
import Suggestion from './Suggestion';
import { EmojiResult } from '../../store/suggestion/types';

type Props = {
  selected: number;
  results: EmojiResult[];
  onClick: (index: number) => void;
  onHover: (index: number) => void;
};

const useStyles = makeStyles(() => createStyles({
  root: {
    '& span': {
      fontFamily: '\'Noto Serif\', serif',
      margin: 5,
      marginRight: 15,
    },
  },
}));

const EmojiSuggestions: React.FC<Props> = (props) => {
  const {
    results, selected, onClick, onHover,
  } = props;

  const classes = useStyles();

  return (
    <div>
      {results.map(((item, index) => (
        <Suggestion
          key={item.c}
          className={classes.root}
          onClick={() => onClick(index)}
          onHover={() => onHover(index)}
          selected={selected === index}
        >
          <Typography>
            <span>{item.c}</span>
            {item.n}
          </Typography>
        </Suggestion>
      )))}
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { results, selected } = selectors.getSuggestion(state);
  return {
    selected,
    results: results as EmojiResult[],
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onClick: (index: number) => dispatch(actions.chooseSelection(index)),
  onHover: (index: number) => dispatch(actions.selectSuggestion(index)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmojiSuggestions);
