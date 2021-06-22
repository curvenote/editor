/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import scrollIntoView from 'scroll-into-view-if-needed';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { isSuggestionSelected } from '../../store/selectors';
import { Dispatch, State } from '../../store';
import { chooseSelection, selectSuggestion } from '../../store/actions';
import { positionPopper } from '../InlineActions/utils';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: 10,
      cursor: 'pointer',
      clear: 'both',
    },
    selected: {
      backgroundColor: '#e8e8e8',
    },
  }),
);

type Props = {
  index: number;
  className?: string;
};

const Suggestion: React.FC<Props> = (props) => {
  const { index, children, className } = props;
  positionPopper();
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<Dispatch>();
  const selected = useSelector((state: State) => isSuggestionSelected(state, index));

  const onClick = useCallback(() => dispatch(chooseSelection(index)), [index]);
  const onHover = useCallback(() => dispatch(selectSuggestion(index)), [index]);

  useEffect(() => {
    if (ref.current == null || !selected) return;
    scrollIntoView(ref.current, {
      behavior: 'smooth',
      scrollMode: 'if-needed',
      boundary: ref.current.parentElement?.parentElement,
    });
  }, [selected]);

  return (
    <div
      className={classNames(classes.root, {
        [className ?? '']: className,
        [classes.selected]: selected,
      })}
      onClick={onClick}
      onMouseEnter={onHover}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default Suggestion;
