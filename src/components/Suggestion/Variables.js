import React from 'react';
import { connect } from 'react-redux';
import { Typography, makeStyles, createStyles } from '@material-ui/core';
import { selectors, actions } from '../../store';
import Suggestion from './Suggestion';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        position: 'relative',
        '& div': {
            position: 'absolute',
            padding: '0 3px',
            border: '1px solid #FFF',
            fontFamily: 'system- ui, "Noto Sans"',
            fontSize: 12,
            color: '#5f5f5f',
            top: 3,
            right: 3,
            backgroundColor: '#D4D4D4',
            borderRadius: 3,
        },
        '& h6': {
            marginRight: 50,
        },
        '& span': {
            margin: 5,
            marginRight: 50,
        },
    },
}); });
var VariableSuggestions = function (props) {
    var results = props.results, selected = props.selected, onClick = props.onClick, onHover = props.onHover;
    var classes = useStyles();
    return (React.createElement("div", null, results.map((function (item, index) { return (React.createElement(Suggestion, { key: item.id, onClick: function () { return onClick(index); }, onHover: function () { return onHover(index); }, selected: selected === index, className: classes.root },
        item.current !== undefined && React.createElement("div", null, String(item.current)),
        React.createElement(Typography, { variant: "subtitle1" }, item.name),
        React.createElement(Typography, { variant: "caption" }, item.description))); }))));
};
var mapStateToProps = function (state) {
    var _a = selectors.getSuggestion(state), results = _a.results, selected = _a.selected;
    return {
        selected: selected,
        results: results,
    };
};
var mapDispatchToProps = function (dispatch) { return ({
    onClick: function (index) { return dispatch(actions.chooseSelection(index)); },
    onHover: function (index) { return dispatch(actions.selectSuggestion(index)); },
}); };
export default connect(mapStateToProps, mapDispatchToProps)(VariableSuggestions);
//# sourceMappingURL=Variables.js.map