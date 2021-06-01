import React from 'react';
import { makeStyles, createStyles, Tooltip, } from '@material-ui/core';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        font: '11px SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
        fontSize: 11,
        '& kbd': {
            backgroundColor: '#fafbfc',
            border: '1px solid #c6cbd1',
            borderBottomColor: '#959da5',
            borderRadius: 3,
            boxShadow: 'inset 0 -1px 0 #959da5',
            color: '#444d56',
            padding: '3px 5px',
        },
    },
}); });
var mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
function createShortcut(str) {
    return str
        .replace('Shift', '⇧ Shift')
        .replace('Enter', '↵ Enter')
        .replace('Backspace', '← Backspace')
        .replace('Tab', '↹ Tab')
        .replace('Mod', mac ? '⌘ Cmd' : 'Ctrl')
        .replace('Alt', mac ? '⌥ Opt' : 'Alt')
        .split('-');
}
var Keyboard = function (props) {
    var shortcut = props.shortcut;
    var classes = useStyles();
    var array = typeof shortcut === 'string' ? createShortcut(shortcut) : shortcut;
    var text = array.join(' + ');
    return (React.createElement(Tooltip, { title: text },
        React.createElement("span", { className: classes.root }, array.map(function (s) { return React.createElement("kbd", { key: s }, s.split(' ')[0]); }))));
};
export default Keyboard;
//# sourceMappingURL=Keyboard.js.map