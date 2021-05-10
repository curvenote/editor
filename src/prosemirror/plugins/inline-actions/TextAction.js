import React, { useCallback, useState } from 'react';
import { makeStyles, createStyles, Grid, Input, CircularProgress, } from '@material-ui/core';
import MenuIcon from '../../../components/Menu/Icon';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        width: 'fit-content',
        fontSize: 20,
        flexWrap: 'nowrap',
    },
}); });
var TextAction = function (props) {
    var initial = props.text, help = props.help, validate = props.validate, onSubmit = props.onSubmit, onCancel = props.onCancel;
    var classes = useStyles();
    var _a = useState(initial), text = _a[0], setText = _a[1];
    var _b = useState(initial), current = _b[0], setCurrent = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(true), valid = _d[0], setValid = _d[1];
    var updateText = useCallback(function (e) {
        var t = e.currentTarget.value;
        setLoading(true);
        setCurrent(t);
        validate(t).then(function (b) {
            setLoading(false);
            if (b) {
                setValid(true);
                setText(t);
                return;
            }
            setValid(false);
        });
    }, []);
    return (React.createElement(Grid, { container: true, alignItems: "center", justify: "center", className: classes.root },
        React.createElement(MenuIcon, { kind: "cancel", onClick: onCancel }),
        React.createElement(Input, { autoFocus: true, disableUnderline: true, value: current, onChange: updateText, onKeyDownCapture: function (e) {
                if (e.key === 'Enter') {
                    if (!valid || loading)
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
        React.createElement(MenuIcon, { kind: "enterSave", title: valid ? 'Save' : help, disabled: loading || !valid, error: !valid, onClick: function () { return onSubmit(text); } })));
};
export default TextAction;
//# sourceMappingURL=TextAction.js.map