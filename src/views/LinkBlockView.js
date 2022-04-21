import React from 'react';
import { Box } from '@material-ui/core';
import createNodeView from './NodeView';
function LinkBlock(_a) {
    var node = _a.node;
    var _b = node.attrs, title = _b.title, url = _b.url, description = _b.description;
    return (React.createElement(Box, { display: "flex", flexDirection: "column" },
        React.createElement(Box, { border: "1px solid grey" }, url),
        React.createElement(Box, { border: "1px solid grey" }, title),
        React.createElement(Box, { border: "1px solid grey" }, description)));
}
export var createLinkBlockView = createNodeView(LinkBlock, {
    wrapper: 'div',
    enableSelectionHighlight: true,
});
//# sourceMappingURL=LinkBlockView.js.map