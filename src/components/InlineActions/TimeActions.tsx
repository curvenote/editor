import React from 'react';
import { isNodeSelection } from 'prosemirror-utils';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { getDatetime } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import { updateNodeAttrs } from '../../store/actions';
import { State, Dispatch } from '../../store/types';
import { getEditorState } from '../../store/selectors';
import { ActionProps } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';

function TimeActions(props: ActionProps) {
  const { stateId, viewId } = props;
  const dispatch = useDispatch<Dispatch>();
  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  if (!selection || !isNodeSelection(selection)) return null;
  const node = getNodeFromSelection(selection);

  const date = getDatetime(node?.attrs.datetime);
  const { from } = selection;
  const onChange = (newDate: Date | null) => {
    if (!newDate || !node || from == null) return;
    dispatch(
      updateNodeAttrs(
        stateId,
        viewId,
        { node, pos: from },
        { datetime: newDate.toISOString() },
        'after',
      ),
    );
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
}

export default TimeActions;
