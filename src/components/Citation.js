import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles, Typography } from '@material-ui/core';
import { opts } from '../connect';
import MenuIcon from './Menu/Icon';
var useStyles = makeStyles(function () { return createStyles({
    root: {},
}); });
export var useCitation = function (uid) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var _l = useState(false), loading = _l[0], setLoading = _l[1];
    var _m = useState(null), json = _m[0], setJson = _m[1];
    var noJson = json == null;
    useEffect(function () {
        if (!uid)
            return;
        setLoading(true);
        opts.citationKeyToJson(uid).then(function (data) {
            setJson(data);
            setLoading(false);
        });
    }, [uid]);
    var inline = null;
    if (json) {
        var author1 = (_d = (_c = (_b = (_a = json.authors) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : 'Unknown';
        var author2 = (_h = (_g = (_f = (_e = json.authors) === null || _e === void 0 ? void 0 : _e[1]) === null || _f === void 0 ? void 0 : _f.split(',')) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : 'Unknown';
        var year = (_j = json.date) === null || _j === void 0 ? void 0 : _j.getUTCFullYear();
        switch ((_k = json.authors) === null || _k === void 0 ? void 0 : _k.length) {
            case 1:
                inline = author1 + ", " + year;
                break;
            case 2:
                inline = author1 + " & " + author2 + ", " + year;
                break;
            default:
                inline = author1 + " et al., " + year;
        }
    }
    return {
        loading: loading,
        json: json,
        inline: inline,
        error: noJson,
    };
};
var Citation = function (props) {
    var uid = props.uid;
    var classes = useStyles();
    var json = useCitation(uid).json;
    var openUrl = function () { return window.open(json === null || json === void 0 ? void 0 : json.url, '_blank'); };
    return (React.createElement("div", { className: classes.root },
        (json === null || json === void 0 ? void 0 : json.url) && React.createElement("div", { style: { float: 'right' } },
            React.createElement(MenuIcon, { kind: "open", onClick: openUrl })),
        React.createElement(Typography, { variant: "subtitle1" }, json === null || json === void 0 ? void 0 : json.title),
        React.createElement(Typography, { variant: "subtitle2" }, json === null || json === void 0 ? void 0 : json.authors.join(', '))));
};
export default Citation;
//# sourceMappingURL=Citation.js.map