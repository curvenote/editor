import { schemas } from '@curvenote/schema';
import { Plugin, PluginKey } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { isEditable } from './editable';
export var key = new PluginKey('prompt');
var getParentIfParagraph = findParentNode(function (node) { return node.type.name === schemas.nodeNames.paragraph; });
var getPromptPlugin = function () {
    var promptPlugin = new Plugin({
        key: key,
        state: {
            init: function () { return DecorationSet.empty; },
            apply: function (tr, value, oldState, newState) {
                if (!isEditable(newState))
                    return DecorationSet.empty;
                var paragraph = getParentIfParagraph(newState.selection);
                var emptyParagraph = paragraph && paragraph.node.nodeSize === 2;
                if (tr.selection.empty && emptyParagraph) {
                    var deco = Decoration.node(tr.selection.from - 1, tr.selection.to + 1, {
                        class: 'prompt',
                    });
                    return DecorationSet.create(tr.doc, [deco]);
                }
                return DecorationSet.empty;
            },
        },
        props: {
            decorations: function (state) {
                return this.getState(state);
            },
        },
    });
    return promptPlugin;
};
export default getPromptPlugin;
//# sourceMappingURL=prompts.js.map