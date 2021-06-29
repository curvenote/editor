import { schemas } from '@curvenote/schema';
import { Plugin, PluginKey } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { isEditable } from './editable';
export var key = new PluginKey('prompt');
var getPromptPlugin = function () {
    var promptPlugin = new Plugin({
        key: key,
        state: {
            init: function () { return ({ prompt: DecorationSet.empty }); },
            apply: function (tr, value, oldState, newState) {
                var getParagraph = findParentNode(function (node) { return node.type.name === schemas.nodeNames.paragraph; });
                var para = getParagraph(tr.selection);
                var editable = isEditable(newState);
                if (editable && tr.selection.empty && para && para.node.nodeSize === 2) {
                    var deco = Decoration.node(tr.selection.from - 1, tr.selection.to + 1, {
                        class: 'prompt',
                    });
                    return { prompt: new DecorationSet().add(tr.doc, [deco]) };
                }
                return {
                    prompt: DecorationSet.empty,
                };
            },
        },
        props: {
            decorations: function (state) { return promptPlugin.getState(state).prompt; },
        },
    });
    return promptPlugin;
};
export default getPromptPlugin;
//# sourceMappingURL=prompts.js.map