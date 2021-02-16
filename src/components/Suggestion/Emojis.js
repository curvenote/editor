import React from 'react';
import { connect } from 'react-redux';
import { makeStyles, createStyles, Typography } from '@material-ui/core';
import { selectors, actions } from '../../store';
import Suggestion from './Suggestion';
var useStyles = makeStyles(function () { return createStyles({
    root: {
        '& span': {
            fontFamily: '\'Noto Serif\', serif',
            margin: 5,
            marginRight: 15,
        },
    },
}); });
var EmojiSuggestions = function (props) {
    var results = props.results, selected = props.selected, onClick = props.onClick, onHover = props.onHover;
    var classes = useStyles();
    return (React.createElement("div", null, results.map((function (item, index) { return (React.createElement(Suggestion, { key: item.c, className: classes.root, onClick: function () { return onClick(index); }, onHover: function () { return onHover(index); }, selected: selected === index },
        React.createElement(Typography, null,
            React.createElement("span", null, item.c),
            item.n))); }))));
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
export default connect(mapStateToProps, mapDispatchToProps)(EmojiSuggestions);
//# sourceMappingURL=Emojis.js.map