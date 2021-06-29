import React from 'react';
import { isNodeSelection } from 'prosemirror-utils';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { getDatetime } from '@curvenote/schema/dist/nodes/time';
import { useDispatch, useSelector } from 'react-redux';
import { updateNodeAttrs } from '../../store/actions';
import { getEditorState } from '../../store/selectors';
import { getNodeFromSelection } from '../../store/ui/utils';
var TimeActions = function (props) {
    var stateId = props.stateId, viewId = props.viewId;
    var dispatch = useDispatch();
    var selection = useSelector(function (state) { var _a, _b; return (_b = (_a = getEditorState(state, stateId)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.selection; });
    if (!selection || !isNodeSelection(selection))
        return null;
    var node = getNodeFromSelection(selection);
    var date = getDatetime(node === null || node === void 0 ? void 0 : node.attrs.datetime);
    var from = selection.from;
    var onChange = function (newDate) {
        if (!newDate || !node || from == null)
            return;
        dispatch(updateNodeAttrs(stateId, viewId, { node: node, pos: from }, { datetime: newDate.toISOString() }, 'after'));
    };
    return (React.createElement(MuiPickersUtilsProvider, { utils: DateFnsUtils },
        React.createElement(DatePicker, { variant: "static", format: "MM/dd/yyyy", margin: "normal", id: "date-picker-inline", label: "Date", value: date, onChange: onChange })));
};
export default TimeActions;
//# sourceMappingURL=TimeActions.js.map