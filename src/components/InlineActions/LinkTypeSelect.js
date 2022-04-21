import React from 'react';
import { makeStyles, createStyles, FormControl, Select, MenuItem } from '@material-ui/core';
import { LINK_TYPES } from '../types';
var useStyles = makeStyles(function () {
    return createStyles({
        menulist: {
            maxHeight: '15rem',
        },
    });
});
var LABELS = {
    link: 'Link',
    'link-block': 'Card',
};
export function LinkTypeSelect(_a) {
    var value = _a.value, onChange = _a.onChange;
    var classes = useStyles();
    return (React.createElement(FormControl, null,
        React.createElement(Select, { disableUnderline: true, onChange: function (e) {
                onChange(e.target.value);
            }, value: value, MenuProps: {
                className: 'above-modals',
                MenuListProps: {
                    className: classes.menulist,
                },
            } }, LINK_TYPES.map(function (name) { return (React.createElement(MenuItem, { key: name, value: name }, LABELS[name])); }))));
}
//# sourceMappingURL=LinkTypeSelect.js.map