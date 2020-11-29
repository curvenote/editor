import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { v4 as uuid } from 'uuid';
import { opts } from '../../../connect';

export const key = new PluginKey('placeholder');

export type ImagePlaceholderPlugin = Plugin<DecorationSet>;

export type Action = (
  { add: { id: string; pos: number; dataUrl: string } } |
  { remove: { id: string } }
);

export const getImagePlaceholderPlugin = (): ImagePlaceholderPlugin => new Plugin({
  key,
  state: {
    init() { return DecorationSet.empty; },
    apply(tr, setIn) {
      // Adjust decoration positions to changes made by the transaction
      let set: DecorationSet = setIn.map(tr.mapping, tr.doc);
      // See if the transaction adds or removes any placeholders
      const action: Action = tr.getMeta(this);
      if (action && 'add' in action) {
        const widget = document.createElement('img');
        widget.src = action.add.dataUrl;
        widget.classList.add('placeholder');
        const deco = Decoration.widget(action.add.pos, widget, { id: action.add.id });
        set = set.add(tr.doc, [deco]);
      } else if (action && 'remove' in action) {
        set = set.remove(set.find(undefined, undefined, (spec) => spec.id === action.remove.id));
      }
      return set;
    },
  },
  props: {
    decorations(state) { return this.getState(state); },
  },
});

const findImagePlaceholder = (state: EditorState, id: string) => {
  const plugin = key.get(state) as ImagePlaceholderPlugin;
  const decos = plugin.getState(state);
  const found = decos.find(undefined, undefined, (spec) => spec.id === id);
  return found.length ? found[0].from : null;
};

export const addImagePlaceholder = (view: EditorView, dataUrl: string) => {
  const id = uuid();
  const { tr } = view.state;
  if (!tr.selection.empty) tr.deleteSelection();
  const plugin = key.get(view.state) as ImagePlaceholderPlugin;
  const action: Action = { add: { id, pos: tr.selection.from, dataUrl } };
  tr.setMeta(plugin, action);
  view.dispatch(tr);
  const fail = () => {
    view.dispatch(view.state.tr.setMeta(plugin, { remove: { id } }));
  };
  const success = (url: string) => {
    const pos = findImagePlaceholder(view.state, id);
    if (pos == null) return;
    view.dispatch(view.state.tr
      .replaceWith(pos, pos, view.state.schema.nodes.image.create({ src: url }))
      .setMeta(plugin, { remove: { id } }));
  };
  return { success, fail };
};

const getImages = (data: DataTransfer | null) => {
  const items = data?.items ?? [];
  const images = Array(items.length).fill('').map((v, i) => {
    if (items[i].type.indexOf('image') === -1) return null;
    return items[i].getAsFile();
  }).filter((b) => b != null) as File[];
  return images;
};

const fileToDataUrl = (
  blob: File, callback: (canvas: HTMLCanvasElement) => void,
) => {
  const URLObj = window.URL ?? window.webkitURL;
  const mycanvas = document.createElement('canvas');
  const ctx = mycanvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    mycanvas.width = img.width;
    mycanvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    callback(mycanvas);
  };
  img.src = URLObj.createObjectURL(blob);
};

export const uploadAndInsertImages = (view: EditorView, data: DataTransfer | null): boolean => {
  const images = getImages(data);
  if (images.length === 0) return false;
  fileToDataUrl(images[0], async (canvas) => {
    const uri = canvas.toDataURL('image/png');
    const finish = addImagePlaceholder(view, uri);
    let s: string | null;
    try {
      s = await opts.image.upload(images[0]);
    } catch (error) {
      s = null;
    }
    if (s == null) { finish.fail(); return; }
    finish.success(s);
  });
  return true;
};
