import React, { useCallback, useState } from 'react';
import { makeStyles, createStyles, Grid, Input, CircularProgress } from '@material-ui/core';
import MenuIcon from '../Menu/Icon';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            fontSize: 20,
            flexWrap: 'nowrap',
        },
        input: {
            flexGrow: 1,
        },
    });
});
function TextAction(props) {
    var initial = props.text, help = props.help, validate = props.validate, onSubmit = props.onSubmit, onCancel = props.onCancel, onChange = props.onChange, _a = props.enableSubmitIfInvalid, enableSubmitIfInvalid = _a === void 0 ? false : _a;
    var classes = useStyles();
    var _b = useState(initial), text = _b[0], setText = _b[1];
    var _c = useState(initial), current = _c[0], setCurrent = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(true), valid = _e[0], setValid = _e[1];
    var updateText = useCallback(function (e) {
        var t = e.currentTarget.value;
        if (!validate) {
            setValid(true);
            setText(t);
            setCurrent(t);
            onChange === null || onChange === void 0 ? void 0 : onChange(t);
            return;
        }
        setLoading(true);
        setCurrent(t);
        onChange === null || onChange === void 0 ? void 0 : onChange(t);
        Promise.all([validate(t)]).then(function (_a) {
            var b = _a[0];
            setLoading(false);
            if (enableSubmitIfInvalid || b) {
                setValid(b);
                setText(t);
                return;
            }
            setValid(false);
        });
    }, [onChange, validate, enableSubmitIfInvalid]);
    return (React.createElement(Grid, { container: true, alignItems: "center", justifyContent: "space-between", className: classes.root },
        React.createElement(MenuIcon, { kind: "cancel", onClick: onCancel }),
        React.createElement(Input, { autoFocus: true, disableUnderline: true, fullWidth: true, value: current, className: classes.input, onChange: updateText, onKeyDownCapture: function (e) {
                if (e.key === 'Enter') {
                    if (loading)
                        return;
                    if (!valid && !enableSubmitIfInvalid)
                        return;
                    e.stopPropagation();
                    e.preventDefault();
                    onSubmit(text);
                }
                else if (e.key === 'Escape') {
                    e.stopPropagation();
                    e.preventDefault();
                    onCancel();
                }
            } }),
        loading && React.createElement(CircularProgress, { size: 18 }),
        React.createElement(MenuIcon, { kind: "enterSave", title: valid ? 'Save' : help, disabled: loading || (!valid && !enableSubmitIfInvalid), error: !valid, onClick: function () { return onSubmit(text); } })));
}
export default TextAction;
//# sourceMappingURL=TextAction.js.map