import { migrateHTML } from '@iooxa/schema';
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import { EditorState, Transaction } from 'prosemirror-state';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { DOMParser as Parser } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import schema from './schema';
import suggestion from './plugins/suggestion';
import { buildKeymap } from './keymap';
import inputrules from './inputrules';
import store from '../connect';
import MathView from './views/math';
import { getImagePlaceholderPlugin, uploadAndInsertImages } from './views/image/placeholder';
import ImageView from './views/image';
import { editablePlugin, isEditable } from './plugins/editable';
import LinkView from './views/link';
import { handleSuggestion } from '../store/suggestion/actions';

export { schema };

export function getPlugins(version: number, startEditable: boolean) {
  return [
    editablePlugin(startEditable),
    ...suggestion(
      (action) => store.dispatch(handleSuggestion(action)),
      /(?:^|\s)(:|\/|(?:(?:^[a-zA-Z0-9_]+)\s?=)|(?:\{\{))$/,
      // Cancel on space after some of the triggers
      (trigger) => !trigger?.match(/(?:(?:[a-zA-Z0-9_]+)\s?=)|(?:\{\{)/),
    ),
    getImagePlaceholderPlugin(),
    inputrules(schema),
    keymap(buildKeymap(schema)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    // collab({ version }),
    history(),
  ];
}

export function createEditorState(content: string, version: number, startEditable: boolean) {
  const plugins = getPlugins(version, startEditable);
  let state: EditorState;
  try {
    const data = JSON.parse(content);
    state = EditorState.fromJSON(
      { schema, plugins },
      { doc: data, selection: { type: 'text', anchor: 0, head: 0 } },
    );
  } catch (error) {
    const element = migrateHTML(content, document, DOMParser);
    const doc = Parser.fromSchema(schema).parse(element);
    state = EditorState.create({ doc, plugins });
  }
  return state;
}

export function createEditorView(
  dom: HTMLDivElement,
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): EditorView {
  const editorView = new EditorView(dom, {
    state,
    dispatchTransaction: dispatch,
    nodeViews: {
      math(node, view, getPos) {
        return new MathView(node, view, getPos as () => number, true);
      },
      equation(node, view, getPos) {
        return new MathView(node, view, getPos as () => number, false);
      },
      image(node, view, getPos) {
        return new ImageView(node, view, getPos as () => number);
      },
      link(node, view, getPos) {
        return new LinkView(node, view, getPos as () => number);
      },
    },
    // This is set in the middleware `tr.setMeta(editable, false)`
    editable: (s) => isEditable(s),
    handleClickOn: (view, pos, node, nodePos, event, direct) => {
      if (direct && event.button === 2) {
        // TODO: Not awesome interaction with material components here...
        // TODO: Better right click
        console.log('RIGHT CLICK?!');
        // event.preventDefault();
        // event.stopPropagation();
        // event.stopImmediatePropagation();
        // store.dispatch(setAttributeEditor(true, view.nodeDOM(nodePos)));
        return false;
      }
      return false;
    },
    handlePaste: (view, event, slice) => (
      uploadAndInsertImages(view, event.clipboardData)
    ),
    handleDrop: (view, event, slice, moved) => (
      uploadAndInsertImages(view, (event as DragEvent).dataTransfer)
    ),
  });
  return editorView;
}
