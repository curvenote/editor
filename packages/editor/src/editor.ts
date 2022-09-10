import { process } from '@curvenote/schema';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { Options } from './connect';
import { setup } from './connect';
import { createEditorState, createEditorView } from './prosemirror';
import type { EditorState, Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import {
  registerEditorState,
  updateSelectView,
  subscribeView,
  updateEditorState,
} from './store/actions';
import type { Store } from './store';

function createStorage<T extends { [key: string]: any }>(initial: T) {
  const storage: T = initial;
  return {
    update(payload: Partial<T>) {
      Object.assign(storage, payload);
    },
    get<K extends keyof T>(key: K): T[K] {
      return storage[key];
    },
    has(key: keyof T) {
      return !!storage[key];
    },
    destroy() {
      for (const prop of Object.getOwnPropertyNames(storage)) {
        delete storage[prop];
      }
    },
  };
}

interface Entities {
  view?: EditorView;
  store?: Store;
}
type EntityStorage = ReturnType<typeof createStorage<Entities>>;

function createInitialState({
  stateKey,
  content,
  editable,
  version,
}: {
  stateKey: string;
  content: string;
  editable: boolean;
  version: number;
}) {
  return createEditorState('full', stateKey, content, version, editable);
}

function modifyTransaction(stateKey: any, viewId: string, state: EditorState, tr: Transaction) {
  let next = tr;
  switch (tr.getMeta('uiEvent')) {
    case 'cut':
    case 'paste':
    case 'drop':
      next = process.modifyTransactionToValidDocState(tr);
      break;
    default:
      break;
  }
  return next;
}

interface InitOpiton {
  stateKey: string;
  viewId: string;
  content: string;
  disabled?: boolean;
  autoUnsubscribe?: boolean;
  version?: number;
  cssClass?: string;
}

export function createEditor(store: Store, options: Options) {
  const entityStorage = createStorage<Entities>({});
  const config = {
    autoUnsubscribe: false,
  };

  setup(store, options);
  return {
    init(
      dom: HTMLDivElement,
      { stateKey, autoUnsubscribe, content, disabled, viewId, version = 0, cssClass }: InitOpiton,
    ) {
      if (entityStorage.has('view')) {
        console.warn('View already exists. This happens when you call init() twice.');
        return;
      }
      config.autoUnsubscribe = !!autoUnsubscribe;
      const initialState = createInitialState({
        stateKey,
        content,
        editable: !disabled,
        version,
      });

      const view = createEditorView(
        dom,
        initialState,
        (tr) => {
          const mtr = modifyTransaction(stateKey, viewId, view.state, tr);
          const next = view.state.apply(mtr);
          store?.dispatch(updateEditorState(stateKey, viewId, next, tr));
          // Immidiately update the view.
          // This is important for properly handling selections.
          // Cannot use react event loop here.

          view.updateState(next);
        },
        { store },
      );
      view.dom.id = viewId;
      view.dom.onfocus = () => {
        store?.dispatch(updateSelectView(viewId));
      };

      store.dispatch(registerEditorState(stateKey, initialState));

      if (cssClass) view.dom.classList.add(...cssClass.split(' '));
      // TODO: revive
      store?.dispatch(subscribeView(stateKey, viewId, view));
      entityStorage.update({ view, store });
    },
    destroy() {
      if (config.autoUnsubscribe) {
        // TODO: revive
        // entityStorage.get('store')?.dispatch(unsubscribeView(stateKey, viewId));
      }
      entityStorage.get('view')?.destroy();
      entityStorage.destroy();
    },
    getView() {
      return entityStorage.get('view');
    },
  };
}

export type Editor = ReturnType<typeof createEditor>;
