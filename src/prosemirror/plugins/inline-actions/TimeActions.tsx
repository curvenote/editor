import React from 'react';
import { EditorView } from 'prosemirror-view';
import { isNodeSelection } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { getDatetime } from '@curvenote/schema/dist/nodes/time';
import { updateNodeAttrsOnView } from '../../../store/actions';

type Props = {
  view: EditorView;
};

const TimeActions = (props: Props) => {
  const { view } = props;
  const { node, from } = view.state.selection as NodeSelection;

  const date = getDatetime(node.attrs.datetime);
  const onChange = (newDate: Date | null) => {
    if (!newDate) return;
    updateNodeAttrsOnView(view, { node, pos: from }, { datetime: newDate.toISOString() }, 'after');
  };
  if (!isNodeSelection(view.state.selection)) return null;
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
