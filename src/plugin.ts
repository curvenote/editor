import { Plugin, PluginSpec, TextSelection } from 'prosemirror-state';
import { MarkType } from 'prosemirror-model';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Options } from './types';
import { MAX_MATCH, pluginKey } from './utils';
import { createInputRule } from './inputRules';

type CodemarkState = {
  decorations: DecorationSet;
  side?: -1;
} | null;

type CursorMetaTr =
  | {
      action: 'add';
      pos: number;
      side?: -1;
    }
  | { action: 'remove' };

function toDom(): Node {
  const span = document.createElement('span');
  span.classList.add('fake-cursor');
  return span;
}

export function getDecorationPlugin() {
  const plugin: Plugin<CodemarkState> = new Plugin({
    key: pluginKey,
    // isInputRules: true, // Enable this when we can discriminate based on `transaction` is defined
    view() {
      return {
        update: (view) => {
          const next = plugin.getState(view.state) as CodemarkState;
          if (next?.decorations) {
            view.dom.classList.add('no-cursor');
          } else {
            view.dom.classList.remove('no-cursor');
          }
        },
      };
    },
    state: {
      init: () => null,
      apply(tr): CodemarkState | null {
        const meta = tr.getMeta(plugin) as CursorMetaTr;
        if (meta?.action === 'add') {
          const deco = Decoration.widget(meta.pos, toDom, { side: meta.side ?? 0 });
          return {
            decorations: DecorationSet.create(tr.doc, [deco]),
            side: meta.side,
          };
        }
        return null;
      },
    },
    props: {
      decorations: (state) => plugin.getState(state)?.decorations ?? DecorationSet.empty,
      handleKeyDown(view, event) {
        const { selection, doc } = view.state;
        if (event.metaKey || event.shiftKey || event.altKey || event.ctrlKey) return false;
        const mark = view.state.schema.marks.code as MarkType;
        const pluginState = plugin.getState(view.state) as CodemarkState;
        if (!selection.empty && event.key === '`') {
          // Create a code mark!
          const { from, to } = selection;
          if (to - from >= MAX_MATCH || doc.rangeHasMark(from, to, mark)) return false;
          const tr = view.state.tr.addMark(from, to, mark.create());
          const meta: CursorMetaTr = { action: 'add', pos: selection.to };
          const selected = tr
            .setSelection(TextSelection.create(tr.doc, to))
            .removeStoredMark(mark)
            .setMeta(plugin, meta);
          view.dispatch(selected);
          return true;
        }
        if (event.key === 'ArrowRight' && selection.empty) {
          const pos = selection.$from;
          const inCode = !!mark.isInSet(pos.marks());
          const nextCode = !!mark.isInSet(pos.marksAcross(doc.resolve(selection.from + 1)) ?? []);
          if (inCode === nextCode && pos.parentOffset !== 0) return false;
          if (inCode && !pluginState?.decorations && pos.parentOffset !== 0) {
            // `code|` --> `code`|
            const meta: CursorMetaTr = { action: 'add', pos: selection.from };
            view.dispatch(view.state.tr.removeStoredMark(mark).setMeta(plugin, meta));
            return true;
          }
          if (
            (nextCode && !pluginState?.decorations && pos.parentOffset !== 0) ||
            (pos.parentOffset === 0 && pluginState?.side === -1)
          ) {
            // |`code` --> `|code`
            const meta: CursorMetaTr = { action: 'add', pos: selection.from };
            view.dispatch(view.state.tr.addStoredMark(mark.create()).setMeta(plugin, meta));
            return true;
          }
        }
        if (event.key === 'ArrowLeft') {
          const inCode = !!mark.isInSet(selection.$from.marks());
          const nextCode = !!mark.isInSet(
            doc.resolve(selection.empty ? selection.from - 1 : selection.from + 1).marks() ?? [],
          );
          if (inCode && pluginState?.side === -1) {
            // New line!
            // ^|`code` --> |^`code`
            return false;
          }
          if (inCode && pluginState?.decorations) {
            // `code`| --> `code|`
            const meta: CursorMetaTr = { action: 'remove' };
            view.dispatch(view.state.tr.addStoredMark(mark.create()).setMeta(plugin, meta));
            return true;
          }
          if (!inCode && pluginState?.decorations) {
            // `|code` --> |`code`
            const meta: CursorMetaTr = { action: 'remove' };
            view.dispatch(view.state.tr.removeStoredMark(mark).setMeta(plugin, meta));
            return true;
          }
          if (inCode === nextCode) return false;
          if ((nextCode || (!selection.empty && inCode)) && !pluginState?.decorations) {
            // `code`_|_ --> `code`|   nextCode
            // `code`███ --> `code`|   !selection.empty && inCode
            // `██de`___ --> `|code`   !selection.empty && nextCode
            const from = selection.empty ? selection.from - 1 : selection.from;
            const meta: CursorMetaTr = { action: 'add', pos: from };
            const selected = view.state.tr
              .setSelection(TextSelection.create(doc, from))
              .setMeta(plugin, meta);
            if (!selection.empty && nextCode) {
              view.dispatch(selected.addStoredMark(mark.create()));
            } else {
              view.dispatch(selected.removeStoredMark(mark));
            }
            return true;
          }
          if ((nextCode || (!selection.empty && inCode)) && !pluginState?.decorations) {
            // `code`_|_ --> `code`|
            // `code`███ --> `code`|
            const from = selection.empty ? selection.from - 1 : selection.from;
            const meta: CursorMetaTr = { action: 'add', pos: from };
            view.dispatch(
              view.state.tr
                .setSelection(TextSelection.create(doc, from))
                .removeStoredMark(mark)
                .setMeta(plugin, meta),
            );
            return true;
          }
          if (inCode && !pluginState?.decorations && selection.$from.parentOffset > 0) {
            // `c|ode` --> `|code`
            const meta: CursorMetaTr = { action: 'add', pos: selection.from - 1 };
            view.dispatch(
              view.state.tr
                .setSelection(TextSelection.create(doc, selection.from - 1))
                .addStoredMark(mark.create())
                .setMeta(plugin, meta),
            );
            return true;
          }
          if (inCode && !pluginState?.decorations && selection.$from.parentOffset === 0) {
            // Start of line
            // ^`|code` --> ^|`code`
            const meta: CursorMetaTr = { action: 'add', pos: selection.from, side: -1 };
            view.dispatch(view.state.tr.removeStoredMark(mark).setMeta(plugin, meta));
            return true;
          }
        }
        if (event.key === 'Backspace') {
          if (selection.empty && selection.$from.parentOffset === 0) {
            // No override at the start of the line!
            return false;
          }
          const inCode = !!mark.isInSet(selection.$from.marks());
          const nextCode = !!mark.isInSet(
            doc.resolve(selection.empty ? selection.from - 1 : selection.from + 1).marks() ?? [],
          );
          const plusCode = !!mark.isInSet(
            doc.resolve(selection.empty ? selection.from + 1 : selection.to + 1).marks() ?? [],
          );
          if (inCode === nextCode && (inCode === plusCode || !plusCode)) return false;
          let { tr } = view.state;
          if (selection.empty) {
            tr = tr.delete(selection.from - 1, selection.from);
          } else {
            tr = tr.delete(selection.from, selection.to);
          }
          if ((nextCode && selection.empty) || (inCode && !selection.empty)) {
            // `code`_|_ --> `code`|     nextCode && selection.empty
            // `code`███ --> `code`|     inCode && !selection.empty
            const meta: CursorMetaTr = { action: 'add', pos: tr.selection.from };
            view.dispatch(tr.removeStoredMark(mark).setMeta(plugin, meta));
            return true;
          }
          if (tr.selection.$from.parentOffset === 0) {
            // ^███`code` --> `|ode`
            const meta: CursorMetaTr = { action: 'add', pos: tr.selection.from, side: -1 };
            view.dispatch(tr.removeStoredMark(mark).setMeta(plugin, meta));
            return true;
          }
          if (inCode || nextCode) {
            // `c|ode` --> `|ode`
            // `██de` --> `|de`
            const meta: CursorMetaTr = { action: 'add', pos: tr.selection.from };
            view.dispatch(tr.addStoredMark(mark.create()).setMeta(plugin, meta));
            return true;
          }
        }
        return false;
      },
    },
  } as PluginSpec);
  return plugin;
}

export function codemark(opts: Options) {
  const { markType } = opts;
  const cursorPlugin = getDecorationPlugin();
  const inputRule = createInputRule(cursorPlugin);
  const rules: Plugin[] = [cursorPlugin, inputRule];
  return rules;
}
