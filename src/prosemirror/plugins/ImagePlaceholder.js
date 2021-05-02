var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { v4 as uuid } from 'uuid';
import { opts } from '../../connect';
export var key = new PluginKey('placeholder');
export var getImagePlaceholderPlugin = function () { return new Plugin({
    key: key,
    state: {
        init: function () { return DecorationSet.empty; },
        apply: function (tr, setIn) {
            var set = setIn.map(tr.mapping, tr.doc);
            var action = tr.getMeta(this);
            if (action && 'add' in action) {
                var widget = document.createElement('img');
                widget.src = action.add.dataUrl;
                widget.classList.add('placeholder');
                var deco = Decoration.widget(action.add.pos, widget, { id: action.add.id });
                set = set.add(tr.doc, [deco]);
            }
            else if (action && 'remove' in action) {
                set = set.remove(set.find(undefined, undefined, function (spec) { return spec.id === action.remove.id; }));
            }
            return set;
        },
    },
    props: {
        decorations: function (state) { return this.getState(state); },
    },
}); };
var findImagePlaceholder = function (state, id) {
    var plugin = key.get(state);
    var decos = plugin.getState(state);
    var found = decos.find(undefined, undefined, function (spec) { return spec.id === id; });
    return found.length ? found[0].from : null;
};
export var addImagePlaceholder = function (view, dataUrl) {
    var id = uuid();
    var tr = view.state.tr;
    if (!tr.selection.empty)
        tr.deleteSelection();
    var plugin = key.get(view.state);
    var action = { add: { id: id, pos: tr.selection.from, dataUrl: dataUrl } };
    tr.setMeta(plugin, action);
    view.dispatch(tr);
    var fail = function () {
        view.dispatch(view.state.tr.setMeta(plugin, { remove: { id: id } }));
    };
    var success = function (url) {
        var pos = findImagePlaceholder(view.state, id);
        if (pos == null)
            return;
        view.dispatch(view.state.tr
            .replaceWith(pos, pos, view.state.schema.nodes.image.create({ src: url }))
            .setMeta(plugin, { remove: { id: id } }));
    };
    return { success: success, fail: fail };
};
var getImages = function (data) {
    var _a;
    var items = (_a = data === null || data === void 0 ? void 0 : data.items) !== null && _a !== void 0 ? _a : [];
    var images = Array(items.length).fill('').map(function (v, i) {
        if (items[i].type.indexOf('image') === -1)
            return null;
        return items[i].getAsFile();
    }).filter(function (b) { return b != null; });
    return images;
};
var fileToDataUrl = function (blob, callback) {
    var _a;
    var URLObj = (_a = window.URL) !== null && _a !== void 0 ? _a : window.webkitURL;
    var mycanvas = document.createElement('canvas');
    var ctx = mycanvas.getContext('2d');
    var img = new Image();
    img.onload = function () {
        mycanvas.width = img.width;
        mycanvas.height = img.height;
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 0, 0);
        callback(mycanvas);
    };
    img.src = URLObj.createObjectURL(blob);
};
export var uploadAndInsertImages = function (view, data) {
    var images = getImages(data);
    if (images.length === 0)
        return false;
    fileToDataUrl(images[0], function (canvas) { return __awaiter(void 0, void 0, void 0, function () {
        var uri, finish, s, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = canvas.toDataURL('image/png');
                    finish = addImagePlaceholder(view, uri);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, opts.uploadImage(images[0])];
                case 2:
                    s = _a.sent();
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    s = null;
                    return [3, 4];
                case 4:
                    if (s == null) {
                        finish.fail();
                        return [2];
                    }
                    finish.success(s);
                    return [2];
            }
        });
    }); });
    return true;
};
//# sourceMappingURL=ImagePlaceholder.js.map