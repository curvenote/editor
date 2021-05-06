import React from 'react';
import { isNodeSelection } from 'prosemirror-utils';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { getDatetime } from '@curvenote/schema/dist/nodes/time';
import { updateNodeAttrsOnView } from '../../../store/actions';
var TimeActions = function (props) {
    var view = props.view;
    var _a = view.state.selection, node = _a.node, from = _a.from;
    var date = getDatetime(node.attrs.datetime);
    var onChange = function (newDate) {
        if (!newDate)
            return;
        updateNodeAttrsOnView(view, { node: node, pos: from }, { datetime: newDate.toISOString() }, 'after');
    };
    if (!isNodeSelection(view.state.selection))
        return null;
    return (React.createElement(MuiPickersUtilsProvider, { utils: DateFnsUtils },
        React.createElement(DatePicker, { variant: "static", format: "MM/dd/yyyy", margin: "normal", id: "date-picker-inline", label: "Date", value: date, onChange: onChange })));
};
export default TimeActions;
//# sourceMappingURL=TimeActions.js.map