import { Plugin, PluginSpec } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { CodemarkState, CursorMetaTr, Options } from './types';
import { pluginKey } from './utils';
import { createInputRule } from './inputRules';
import {
  onArrowLeft,
  onArrowRight,
  onBackspace,
  onBacktick,
  stepOutside,
  stepOutsideNextTrAndPass,
} from './actions';

function toDom(): Node {
  const span = document.createElement('span');
  span.classList.add('fake-cursor');
  return span;
}

function getMarkType(view: EditorView, opts?: Options) {
  return opts?.markType ?? view.state.schema.marks.code;
}

export function getDecorationPlugin(opts?: Options) {
  const plugin: Plugin<CodemarkState> = new Plugin({
    key: pluginKey,
    view() {
      return {
        update: (view) => {
          const state = plugin.getState(view.state) as CodemarkState;
          view.dom.classList[state?.decorations ? 'add' : 'remove']('no-cursor');
          if (state?.check) stepOutside(view, plugin, getMarkType(view, opts));
        },
      };
    },
    state: {
      init: () => null,
      apply(tr, value, oldState): CodemarkState | null {
        const meta = tr.getMeta(plugin) as CursorMetaTr | null;
        const prev = plugin.getState(oldState) as CodemarkState;
        // If the previous action told us to check, trigger the view to render
        if (prev?.next) return { check: true };
        switch (meta?.action) {
          case 'add': {
            const deco = Decoration.widget(meta.pos, toDom, { side: meta.side ?? 0 });
            return {
              decorations: DecorationSet.create(tr.doc, [deco]),
              side: meta.side,
            };
          }
          case 'next':
            // The transaction puts a flag that we will check next
            // On the next transaction this turns into { check: true }
            // Used on complex cursor movements that are not overridden
            return { next: true };
          case 'remove':
          default:
            return null;
        }
      },
    },
    props: {
      decorations: (state) => plugin.getState(state)?.decorations ?? DecorationSet.empty,
      handleKeyDown(view, event) {
        switch (event.key) {
          case '`':
            return onBacktick(view, plugin, event, getMarkType(view, opts));
          case 'ArrowRight':
            return onArrowRight(view, plugin, event, getMarkType(view, opts));
          case 'ArrowLeft':
            return onArrowLeft(view, plugin, event, getMarkType(view, opts));
          case 'Backspace':
            return onBackspace(view, plugin, event, getMarkType(view, opts));
          case 'ArrowUp':
          case 'ArrowDown':
          case 'Home':
          case 'End':
            return stepOutsideNextTrAndPass(view, plugin);
          case 'e':
          case 'a':
            if (!event.ctrlKey) return false;
            return stepOutsideNextTrAndPass(view, plugin);
          default:
            return false;
        }
      },
    },
  } as PluginSpec);
  return plugin;
}

export function codemark(opts?: Options) {
  const cursorPlugin = getDecorationPlugin(opts);
  const inputRule = createInputRule(cursorPlugin);
  const rules: Plugin[] = [cursorPlugin, inputRule];
  return rules;
}
