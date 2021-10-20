/* eslint-disable no-param-reassign */
import { nodeNames } from '@curvenote/schema';
import { Fragment, Node } from 'prosemirror-model';
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
  success: (urls: string[]) => void;
}

interface PromptActionProps extends PromptProps {
  id: string;
  pos: number;
}

interface PromptAction {
  prompt: PromptActionProps;
}

interface AddAction {
  add: { id: string; pos: number; dataUrls: string[] };
}

interface RemoveAction {
  remove: { id: string };
}

export type Action = AddAction | RemoveAction | PromptAction;

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

function mapFileList<T>(files: FileList, callback: (file: File) => T): T[] {
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
  const uploadLabel = document.createElement('label');
  const uploadInput = document.createElement('input');
  uploadInput.addEventListener('change', async () => {
    if (!uploadInput.files) {
      return;
    }
    action.prompt.remove();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    uploadImageFiles(
      action.prompt.view,
      mapFileList(uploadInput.files, (f) => f),
    );
  });
  uploadInput.type = 'file';
  uploadInput.multiple = true;
  uploadInput.accept = 'image/*';
  uploadInput.classList.add('upload');

  uploadLabel.innerText = 'Upload Image';
  uploadLabel.append(uploadInput);

  const uploadDescription = document.createElement('div');
  uploadDescription.classList.add('description');
  uploadDescription.innerText = 'Drag and drop or click to upload image';

  const uploadContainer = document.createElement('div');
  uploadContainer.classList.add('upload-container');
  uploadContainer.append(uploadLabel);
  uploadContainer.append(uploadDescription);

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

  const close = document.createElement('button');
  close.classList.add('close-icon');
  close.addEventListener('click', () => action.prompt.remove());

  widget.append(uploadContainer);
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
          const widget = document.createElement('div');
          action.add.dataUrls.forEach((uri) => {
            const img = document.createElement('img');
            img.src = uri;
            img.classList.add('placeholder');
            widget.appendChild(img);
          });
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
  function remove(targetId?: string) {
    view.dispatch(view.state.tr.setMeta(plugin, { remove: { id: targetId || id } }));
  }
  function success(urls: string[]) {
    const pos = findImagePlaceholder(view.state, id);
    if (pos == null) return;
    const images = urls.map((url) => {
      const attrs = { id: node?.attrs?.id ?? createId(), ...node?.attrs, src: url };
      // TODO: add as figures
      return view.state.schema.nodes.image.create(attrs);
    });
    const fragment = Fragment.fromArray(images);
    view.dispatch(
      view.state.tr.replaceWith(pos, pos, fragment).setMeta(plugin, { remove: { id } }),
    );
  }
  return { success, remove, view };
}

function setup(view: EditorView) {
  const { tr } = view.state;
  if (!tr.selection.empty) tr.deleteSelection();
  const plugin = key.get(view.state) as ImagePlaceholderPlugin;
  return { plugin, tr };
}

const promptId = uuid(); // prompt id is shared across all editors, to ensure there's only one prompt opens at a time
export function addImagePrompt(view: EditorView) {
  const id = promptId;
  const { plugin, tr } = setup(view);
  const { success, remove } = createImageHandlers(view, id, plugin);
  remove(id); // remove any existing prompts
  const action: PromptAction = {
    prompt: { id, pos: tr.selection.from, remove, success, view },
  };
  tr.setMeta(plugin, action);
  view.dispatch(tr);
}

function addImagePlaceholder(
  view: EditorView,
  id: string,
  dataUrls: string[],
  node: Node | null,
): PromptProps {
  const { plugin, tr } = setup(view);
  const { success, remove } = createImageHandlers(view, id, plugin, node);
  const action: Action = { add: { id, pos: tr.selection.from, dataUrls } };
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

async function uploadImageFiles(view: EditorView, images: File[]) {
  const node = getNodeIfSelected(view.state, nodeNames.image);
  const dataUrls = await Promise.all(images.map((file) => fileToDataUrlAsPromise(file)));
  const id = uuid();
  // If there is only one image, allow it to replace
  const nodeToUse = dataUrls.length === 1 ? node : null;
  const { success, remove } = addImagePlaceholder(view, id, dataUrls, nodeToUse);
  let urls;
  try {
    urls = await Promise.all(images.map((file) => opts.uploadImage(file, nodeToUse)));
  } catch (error) {
    remove();
    return;
  }
  const validUrls = urls.filter((url) => url) as string[];
  if (validUrls.length === 0) {
    remove();
    return;
  }
  success(validUrls);
}

export function uploadAndInsertImages(view: EditorView, data: DataTransfer | null): boolean {
  const images = getImages(data);
  if (images.length === 0) return false;
  uploadImageFiles(view, images);
  return true;
}
