var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { nodeNames, createId } from '@curvenote/schema';
import { Fragment } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { v4 as uuid } from 'uuid';
import { opts } from '../../connect';
import { createFigure } from '../../store/actions/utils';
import { getNodeIfSelected } from '../../store/ui/utils';
export var key = new PluginKey('placeholder');
function fileToDataUrl(blob, callback) {
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
}
function fileToDataUrlAsPromise(blob) {
    return new Promise(function (resolve) {
        fileToDataUrl(blob, function (canvas) {
            resolve(canvas.toDataURL('image/png'));
        });
    });
}
function mapFileList(files, callback) {
    var result = [];
    for (var i = 0; i < files.length; i++) {
        result.push(callback(files[i]));
    }
    return result;
}
function mapDataTransferItemList(files, callback) {
    var result = [];
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file) {
            result.push(callback(file));
        }
        else {
            result.push(undefined);
        }
    }
    return result;
}
function dragOverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'copy';
}
function createWidget(action) {
    var _this = this;
    var widget = document.createElement('div');
    var uploadLabel = document.createElement('label');
    var uploadInput = document.createElement('input');
    uploadInput.addEventListener('change', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!uploadInput.files) {
                return [2];
            }
            action.prompt.remove();
            uploadImageFiles(action.prompt.view, mapFileList(uploadInput.files, function (f) { return f; }));
            return [2];
        });
    }); });
    uploadInput.type = 'file';
    uploadInput.multiple = true;
    uploadInput.accept = 'image/*';
    uploadInput.classList.add('upload');
    uploadLabel.innerText = 'Upload Image';
    uploadLabel.append(uploadInput);
    var uploadDescription = document.createElement('div');
    uploadDescription.classList.add('description');
    uploadDescription.innerText = 'Drag and drop or click to upload image';
    var uploadContainer = document.createElement('div');
    uploadContainer.classList.add('upload-container');
    uploadContainer.append(uploadLabel);
    uploadContainer.append(uploadDescription);
    widget.addEventListener('drop', function (e) {
        var _a;
        e.preventDefault();
        action.prompt.remove();
        var items = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.items;
        if (!items) {
            return;
        }
        uploadImageFiles(action.prompt.view, mapDataTransferItemList(items, function (f) { return f.getAsFile(); }).filter(function (v) { return v; }));
    });
    widget.addEventListener('dragover', function (e) {
        dragOverHandler(e);
        widget.classList.add('is-dragover');
    });
    widget.addEventListener('dragend drop dragleave', function () {
        widget.classList.remove('is-dragover');
    });
    ['dragend', 'drop', 'dragleave'].forEach(function (eventName) {
        widget.addEventListener(eventName, function () {
            widget.classList.remove('is-dragover');
        });
    });
    var close = document.createElement('button');
    close.classList.add('close-icon');
    close.addEventListener('click', function () { return action.prompt.remove(); });
    widget.append(uploadContainer);
    widget.append(close);
    widget.classList.add('image-upload-prompt');
    return widget;
}
export var getImagePlaceholderPlugin = function () {
    return new Plugin({
        key: key,
        state: {
            init: function () {
                return DecorationSet.empty;
            },
            apply: function (tr, setIn) {
                var set = setIn.map(tr.mapping, tr.doc);
                var action = tr.getMeta(this);
                if (!action)
                    return set;
                if ('add' in action) {
                    var widget_1 = document.createElement('div');
                    action.add.dataUrls.forEach(function (uri) {
                        var img = document.createElement('img');
                        img.src = uri;
                        img.classList.add('placeholder');
                        widget_1.appendChild(img);
                    });
                    var deco = Decoration.widget(action.add.pos, widget_1, { id: action.add.id });
                    set = set.add(tr.doc, [deco]);
                }
                else if ('remove' in action) {
                    set = set.remove(set.find(undefined, undefined, function (spec) { return spec.id === action.remove.id; }));
                }
                else if ('prompt' in action) {
                    var widget = createWidget(action);
                    var deco = Decoration.widget(action.prompt.pos, widget, { id: action.prompt.id });
                    set = set.add(tr.doc, [deco]);
                }
                return set;
            },
        },
        props: {
            decorations: function (state) {
                return this.getState(state);
            },
        },
    });
};
var findImagePlaceholder = function (state, id) {
    var plugin = key.get(state);
    var decos = plugin.getState(state);
    var found = decos.find(undefined, undefined, function (spec) {
        return spec.id === id;
    });
    return found.length ? found[0].from : null;
};
function createImageHandlers(view, id, plugin, node) {
    function remove(targetId) {
        view.dispatch(view.state.tr.setMeta(plugin, { remove: { id: targetId || id } }));
    }
    function success(states) {
        var pos = findImagePlaceholder(view.state, id);
        if (pos == null)
            return;
        var images = states.map(function (url) {
            var _a, _b;
            var attrs = __assign(__assign({ id: (_b = (_a = node === null || node === void 0 ? void 0 : node.attrs) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : createId() }, node === null || node === void 0 ? void 0 : node.attrs), { src: url });
            var figure = createFigure(view.state.schema, view.state.schema.nodes.image.create(attrs));
            return figure;
        });
        var fragment = Fragment.fromArray(images);
        view.dispatch(view.state.tr.replaceWith(pos, pos, fragment).setMeta(plugin, { remove: { id: id } }));
    }
    return { success: success, remove: remove, view: view };
}
function setup(view) {
    var tr = view.state.tr;
    if (!tr.selection.empty)
        tr.deleteSelection();
    var plugin = key.get(view.state);
    return { plugin: plugin, tr: tr };
}
var promptId = uuid();
export function addImagePrompt(view) {
    var id = promptId;
    var _a = setup(view), plugin = _a.plugin, tr = _a.tr;
    var _b = createImageHandlers(view, id, plugin), success = _b.success, remove = _b.remove;
    remove(id);
    var action = {
        prompt: { id: id, pos: tr.selection.from, remove: remove, success: success, view: view },
    };
    tr.setMeta(plugin, action);
    view.dispatch(tr);
}
function addImagePlaceholder(view, id, dataUrls, node) {
    var _a = setup(view), plugin = _a.plugin, tr = _a.tr;
    var _b = createImageHandlers(view, id, plugin, node), success = _b.success, remove = _b.remove;
    var action = { add: { id: id, pos: tr.selection.from, dataUrls: dataUrls } };
    tr.setMeta(plugin, action);
    view.dispatch(tr);
    return { success: success, remove: remove, view: view };
}
function getImages(data) {
    var _a;
    var items = (_a = data === null || data === void 0 ? void 0 : data.items) !== null && _a !== void 0 ? _a : [];
    var images = Array(items.length)
        .fill('')
        .map(function (v, i) {
        if (items[i].type.indexOf('image') === -1)
            return null;
        return items[i].getAsFile();
    })
        .filter(function (b) { return b != null; });
    return images;
}
function uploadImageFiles(view, images) {
    return __awaiter(this, void 0, void 0, function () {
        var node, dataUrls, id, nodeToUse, _a, success, remove, urls, error_1, validUrls;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    node = getNodeIfSelected(view.state, nodeNames.image);
                    return [4, Promise.all(images.map(function (file) { return fileToDataUrlAsPromise(file); }))];
                case 1:
                    dataUrls = _b.sent();
                    id = uuid();
                    nodeToUse = dataUrls.length === 1 ? node : null;
                    _a = addImagePlaceholder(view, id, dataUrls, nodeToUse), success = _a.success, remove = _a.remove;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4, Promise.all(images.map(function (file) { return opts.uploadImage(file, nodeToUse); }))];
                case 3:
                    urls = _b.sent();
                    return [3, 5];
                case 4:
                    error_1 = _b.sent();
                    remove();
                    return [2];
                case 5:
                    validUrls = urls.filter(function (url) { return url; });
                    if (validUrls.length === 0) {
                        remove();
                        return [2];
                    }
                    success(validUrls);
                    return [2];
            }
        });
    });
}
export function uploadAndInsertImages(view, data) {
    var images = getImages(data);
    if (images.length === 0)
        return false;
    uploadImageFiles(view, images);
    return true;
}
//# sourceMappingURL=ImagePlaceholder.js.map