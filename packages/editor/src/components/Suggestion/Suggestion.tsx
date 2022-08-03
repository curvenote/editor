import React, { useCallback, useEffect, useRef } from 'react';
import type { Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import scrollIntoView from 'scroll-into-view-if-needed';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { isSuggestionSelected } from '../../store/selectors';
import { Dispatch, State } from '../../store';
import { chooseSelection, selectSuggestion } from '../../store/actions';

const useStyles = makeStyles<Theme, { selectOnHover: boolean }>(() =>
  createStyles({
    root: {
      padding: 10,
      cursor: 'pointer',
      clear: 'both',
      '&:hover': {
        backgroundColor: ({ selectOnHover }) => (selectOnHover ? 'transparent' : '#f5f5f5'),
      },
    },
    selected: {
      backgroundColor: '#e8e8e8',
    },
  }),
);

type Props = {
  index: number;
  children: React.ReactNode;
  className?: string;
  disableSelectOnHover?: boolean;
};

const voidFn = () => {};

function Suggestion(props: Props) {
  const { index, children, className, disableSelectOnHover } = props;
  const classes = useStyles({ selectOnHover: !disableSelectOnHover });
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
      onMouseEnter={disableSelectOnHover ? voidFn : onHover}
      ref={ref}
    >
      {children}
    </div>
  );
}

export default Suggestion;
