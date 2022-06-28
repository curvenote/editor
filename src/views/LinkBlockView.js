import React from 'react';
import createNodeView from './NodeView';
function LinkBlock(_a) {
    var node = _a.node;
    var _b = node.attrs, title = _b.title, url = _b.url, description = _b.description;
    return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
        React.createElement("div", { style: { border: '1px solid grey' } }, url),
        React.createElement("div", { style: { border: '1px solid grey' } }, title),
        React.createElement("div", { style: { border: '1px solid grey' } }, description)));
}
export var createLinkBlockView = createNodeView(LinkBlock, {
    wrapper: 'div',
    enableSelectionHighlight: true,
});
//# sourceMappingURL=LinkBlockView.js.map