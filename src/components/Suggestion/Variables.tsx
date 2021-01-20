/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Typography, makeStyles, createStyles } from '@material-ui/core';
import { State, Dispatch } from '../../store/types';
import { selectors, actions } from '../../store';
import Suggestion from './Suggestion';
import { VariableResult } from '../../store/suggestion/types';

type Props = {
  selected: number;
  results: VariableResult[];
  onClick: (index: number) => void;
  onHover: (index: number) => void;
};


const useStyles = makeStyles(() => createStyles({
  root: {
    position: 'relative',
    '& div': {
      position: 'absolute',
      padding: '0 3px',
      border: '1px solid #FFF',
      fontFamily: 'system- ui, "Noto Sans"',
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


const VariableSuggestions: React.FC<Props> = (props) => {
  const {
    results, selected, onClick, onHover,
  } = props;

  const classes = useStyles();
  return (
    <div>
      {results.map(((item, index) => (
        <Suggestion
          key={item.id}
          onClick={() => onClick(index)}
          onHover={() => onHover(index)}
          selected={selected === index}
          className={classes.root}
        >
          {item.current !== undefined && <div>{String(item.current)}</div>}
          <Typography variant="subtitle1">
            {item.name}
          </Typography>
          <Typography variant="caption">
            {item.description}
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
    results: results as VariableResult[],
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onClick: (index: number) => dispatch(actions.chooseSelection(index)),
  onHover: (index: number) => dispatch(actions.selectSuggestion(index)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VariableSuggestions);
