/* eslint-disable no-param-reassign */
import { nodeNames } from '@curvenote/schema';
import { Node } from 'prosemirror-model';
import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { v4 as uuid } from 'uuid';
import { opts } from '../../connect';
import { getNodeIfSelected } from '../../store/ui/utils';
import { createId } from '../../utils';

export const key = new PluginKey('placeholder');

export type ImagePlaceholderPlugin = Plugin<DecorationSet>;

interface PromptProps {
  view: EditorView;
  remove: (targetId?: string) => void;
  success: (url: string) => void;
}

interface PromptActionProps extends PromptProps {
  id: string;
  pos: number;
}

interface PromptAction {
  prompt: PromptActionProps;
}

export type Action =
  | { add: { id: string; pos: number; dataUrl: string } }
  | { remove: { id: string } }
  | PromptAction;

function fileToDataUrl(blob: File, callback: (canvas: HTMLCanvasElement) => void) {
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
}

function fileToDataUrlAsPromise(blob: File) {
  return new Promise<string>((resolve) => {
    fileToDataUrl(blob, (canvas) => {
      resolve(canvas.toDataURL('image/png'));
    });
  });
}

function mapFiles<T>(files: FileList, callback: (file: File) => T): T[] {
  const result: T[] = [];
  for (let i = 0; i < files.length; i++) {
    result.push(callback(files[i]));
  }
  return result;
}

type Maybe<T> = T | undefined;

function mapDataTransferItemList<T>(
  files: DataTransferItemList,
  callback: (file: DataTransferItem) => T,
): Maybe<T>[] {
  const result: Maybe<T>[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file) {
      result.push(callback(file));
    } else {
      result.push(undefined);
    }
  }
  return result;
}

function dragOverHandler(ev: any) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = 'copy';
}

function createWidget(action: PromptAction) {
  const widget = document.createElement('div');
  const upload = document.createElement('input');
  const uploadPreview = document.createElement('div');
  upload.addEventListener('change', async (e) => {
    if (!upload.files) {
      return;
    }
    action.prompt.remove();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    uploadImageFiles(
      action.prompt.view,
      mapFiles(upload.files, (f) => f),
    );
  });

  upload.type = 'file';
  upload.multiple = true;
  upload.name = 'uploadImageInput';
  upload.accept = 'image/*';
  const uploadContainer = document.createElement('div');
  const placeholderImage = document.createElement('img');
  placeholderImage.hidden = true;
  uploadContainer.classList.add('uploadContainer');
  uploadContainer.append(placeholderImage);
  uploadContainer.append(uploadPreview);
  widget.append(uploadContainer);
  widget.addEventListener('drop', (e) => {
    e.preventDefault();

    action.prompt.remove();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const items = e.dataTransfer?.items;
    if (!items) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    uploadImageFiles(
      action.prompt.view,
      mapDataTransferItemList(items, (f) => f.getAsFile()).filter((v) => v) as File[],
    );
  });
  widget.addEventListener('dragover', (e) => {
    dragOverHandler(e);
    widget.classList.add('is-dragover');
  });
  widget.addEventListener('dragend drop dragleave', () => {
    widget.classList.remove('is-dragover');
  });

  ['dragend', 'drop', 'dragleave'].forEach((eventName) => {
    widget.addEventListener(eventName, () => {
      widget.classList.remove('is-dragover');
    });
  });
  upload.classList.add('upload');
  upload.innerText = 'Upload Image';
  // TODO: focus on the upload button?
  upload.focus();
  const close = document.createElement('button');
  close.classList.add('close-icon');
  close.addEventListener('click', () => action.prompt.remove());
  widget.append(upload);
  widget.append(close);
  widget.classList.add('image-upload-prompt');
  return widget;
}

export const getImagePlaceholderPlugin = (): ImagePlaceholderPlugin =>
  new Plugin({
    key,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, setIn) {
        // Adjust decoration positions to changes made by the transaction
        let set: DecorationSet = setIn.map(tr.mapping, tr.doc);
        // See if the transaction adds or removes any placeholders
        const action: Action = tr.getMeta(this);
        if (!action) return set;
        if ('add' in action) {
          const widget = document.createElement('img');
          widget.src = action.add.dataUrl;
          widget.classList.add('placeholder');
          const deco = Decoration.widget(action.add.pos, widget, { id: action.add.id });
          set = set.add(tr.doc, [deco]);
        } else if ('remove' in action) {
          set = set.remove(set.find(undefined, undefined, (spec) => spec.id === action.remove.id));
        } else if ('prompt' in action) {
          const widget = createWidget(action);
          const deco = Decoration.widget(action.prompt.pos, widget, { id: action.prompt.id });
          set = set.add(tr.doc, [deco]);
        }
        return set;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });

const findImagePlaceholder = (state: EditorState, id: string) => {
  const plugin = key.get(state) as ImagePlaceholderPlugin;
  const decos = plugin.getState(state);
  const found = decos.find(undefined, undefined, (spec) => {
    return spec.id === id;
  });
  return found.length ? found[0].from : null;
};

function createImageHandlers(
  view: EditorView,
  id: string,
  plugin: ImagePlaceholderPlugin,
  node?: Node | null,
): PromptProps {
  const remove = (targetId?: string) => {
    view.dispatch(view.state.tr.setMeta(plugin, { remove: { id: targetId || id } }));
  };
  const success = (url: string) => {
    const pos = findImagePlaceholder(view.state, id);
    if (pos == null) return;
    const attrs = { id: node?.attrs?.id ?? createId(), ...node?.attrs, src: url };
    view.dispatch(
      view.state.tr
        .replaceWith(pos, pos, view.state.schema.nodes.image.create(attrs)) // TODO: is this replacing too much?
        .setMeta(plugin, { remove: { id } }),
    );
  };
  return { success, remove, view };
}

function setup(view: EditorView) {
  const { tr } = view.state;
  if (!tr.selection.empty) tr.deleteSelection();
  const plugin = key.get(view.state) as ImagePlaceholderPlugin;
  return { plugin, tr };
}

const promptId = uuid(); // TODO: put this into closure shares the life cycle of an editor instance
export function addImagePrompt(view: EditorView) {
  const id = promptId;
  const { plugin, tr } = setup(view);
  const { success, remove } = createImageHandlers(view, id, plugin);
  remove(id);
  const action: PromptAction = {
    prompt: { id, pos: tr.selection.from, remove, success, view },
  };
  tr.setMeta(plugin, action);
  view.dispatch(tr);
}

function addImagePlaceholder(
  view: EditorView,
  id: string,
  dataUrl: string,
  node: Node | null,
): PromptProps {
  const { plugin, tr } = setup(view);
  const { success, remove } = createImageHandlers(view, id, plugin, node);
  const action: Action = { add: { id, pos: tr.selection.from, dataUrl } };
  tr.setMeta(plugin, action);
  view.dispatch(tr);
  return { success, remove, view };
}

function getImages(data: DataTransfer | null) {
  const items = data?.items ?? [];
  const images = Array(items.length)
    .fill('')
    .map((v, i) => {
      if (items[i].type.indexOf('image') === -1) return null;
      return items[i].getAsFile();
    })
    .filter((b) => b != null) as File[];
  return images;
}

function uploadImageFiles(view: EditorView, images: File[]) {
  const node = getNodeIfSelected(view.state, nodeNames.image);
  return Promise.all(
    images.map((file) =>
      fileToDataUrlAsPromise(file).then((uri) => {
        const id = uuid();
        const { success, remove } = addImagePlaceholder(view, id, uri, node);
        return opts
          .uploadImage(file, node)
          .then((url) => {
            if (url == null) {
              remove();
              return;
            }
            success(url);
          })
          .catch(() => {
            remove();
          });
      }),
    ),
  );
}

export function uploadAndInsertImages(view: EditorView, data: DataTransfer | null): boolean {
  const images = getImages(data);
  if (images.length === 0) return false;
  uploadImageFiles(view, images);
  return true;
}
