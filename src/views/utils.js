import { nodeNames } from '@curvenote/schema';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils1';
import { isEditable } from '../prosemirror/plugins/editable';
export function clickSelectFigure(view, getPos) {
    if (!isEditable(view.state))
        return;
    var figure = findParentNode(function (n) { return n.type.name === nodeNames.figure; })(TextSelection.create(view.state.doc, getPos()));
    if (!figure)
        return;
    view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, figure.pos)));
}
//# sourceMappingURL=utils.js.map