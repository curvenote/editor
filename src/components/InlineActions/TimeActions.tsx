import React from 'react';
import { isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { getDatetime } from '@curvenote/schema/dist/nodes/time';
import { useDispatch, useSelector } from 'react-redux';
import { updateNodeAttrs } from '../../store/actions';
import { State, Dispatch } from '../../store/types';
import { getEditorState } from '../../store/selectors';
import { ActionProps } from './utils';

const TimeActions = (props: ActionProps) => {
  const { stateId, viewId } = props;
  const dispatch = useDispatch<Dispatch>();
  const selection = useSelector(
    (state: State) => getEditorState(state, stateId)?.state?.selection,
  );
  if (!selection || !isNodeSelection(selection)) return null;
  const { node, from } = selection as NodeSelection;

  const date = getDatetime(node.attrs.datetime);
  const onChange = (newDate: Date | null) => {
    if (!newDate) return;
    dispatch(updateNodeAttrs(
      stateId, viewId, { node, pos: from }, { datetime: newDate.toISOString() }, 'after',
    ));
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        variant="static"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Date"
        value={date}
        onChange={onChange}
      />
    </MuiPickersUtilsProvider>
  );
};

export default TimeActions;
