import { Plugin, PluginKey, } from 'prosemirror-state';
var key = new PluginKey('editable');
export var isEditable = function (state) {
    var _a;
    if (state == null)
        return false;
    var plugin = key.get(state);
    return (_a = plugin === null || plugin === void 0 ? void 0 : plugin.getState(state)) !== null && _a !== void 0 ? _a : false;
};
export var setEditable = function (state, tr, editable) { return (tr.setMeta(key.get(state), editable)); };
export var editablePlugin = function (startEditable) {
    var plugin = new Plugin({
        key: key,
        state: {
            init: function () { return startEditable; },
            apply: function (tr, value, oldState) {
                var _a;
                var editable = (_a = tr.getMeta(plugin)) !== null && _a !== void 0 ? _a : plugin.getState(oldState);
                return editable;
            },
        },
    });
    return plugin;
};
//# sourceMappingURL=editable.js.map