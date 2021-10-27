import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, makeStyles, createStyles, Box } from '@material-ui/core';
import isEqual from 'lodash.isequal';
import FaceOutlined from '@material-ui/icons/FaceOutlined';
import { State } from '../../store/types';
import { selectors } from '../../store';
import Suggestion from './Suggestion';
import { CommandResult } from '../../store/suggestion/commands';
import Keyboard from '../Keyboard';
import { positionPopper } from '../InlineActions/utils';

const useStyles = makeStyles(() =>
  createStyles({
    img: {
      display: 'inline-block',
    },
  }),
);

export default function CommandSuggestions() {
  const classes = useStyles();
  const results = useSelector(
    (state: State) => selectors.getSuggestionResults<any>(state),
    isEqual,
  );
  positionPopper();
  // const classes = useStyles();
  if (results.length === 0) {
    return <Typography variant="subtitle2">No user found. Invite new handling TODO</Typography>;
  }
  return (
    <div>
      {results.map((item, index) => (
        <Suggestion key={item.email} index={index}>
          <Box display="flex" flexDirection="row">
            <Box width={40} display="flex" justifyContent="center" alignItems="center">
              {item.avatar ? (
                <img
                  className={classes.img}
                  width={40}
                  height={40}
                  src={item.avatar}
                  alt={`${item.name || item.email} avatar`}
                />
              ) : (
                <FaceOutlined />
              )}
            </Box>
            <Box pl={2} display="flex" flexDirection="column" flexGrow={3}>
              <Typography variant="body1">{item.name}</Typography>
              <Typography variant="subtitle2">{item.email}</Typography>
            </Box>
          </Box>
        </Suggestion>
      ))}
    </div>
  );
}
