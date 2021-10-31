import { Plugin, PluginSpec, TextSelection, Transaction } from 'prosemirror-state';
import { MarkType } from 'prosemirror-model';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import { Options } from './types';
import { pluginKey } from './utils';

type CodemarkState = {
  decorations: DecorationSet;
  pos?: number;
  side?: -1;
  transform?: Transaction;
  from?: number;
  to?: number;
  text?: string;
};

const inactiveState: CodemarkState = {
  decorations: DecorationSet.empty,
};

const MAX_MATCH = 100;

type Handler = (
  state: EditorView,
  text: string,
  match: RegExpExecArray,
  from: number,
  to: number,
  plugin: Plugin,
) => boolean;

type Rule = {
  match: RegExp;
  handler: Handler;
};

const markBefore: Rule = {
  match: /`((?:[^`\w]|[\w])+)`$/,
  handler: (view, text, match, from, to, plugin) => {
    const markType = view.state.schema.marks.code;
    // Don't create it if there is code in between!
    if (view.state.doc.rangeHasMark(from, to, markType)) return false;
    const m = match[1];
    const mark = markType.create();
    const pos = from + m.length;
    const tr = view.state.tr.delete(from, from + 1).addMark(from, pos, mark);
    const selected = tr.setSelection(TextSelection.create(tr.doc, pos)).removeStoredMark(markType);
    view.dispatch(
      selected.setMeta(plugin, {
        transform: selected,
        from,
        to,
        text,
        action: 'add',
        pos,
      }),
    );
    return true;
  },
};

const markAfter: Rule = {
  match: /^`((?:[^`\w]|[\w])+)`/,
  handler: (view, text, match, from, to, plugin) => {
    const markType = view.state.schema.marks.code;
    // Don't create it if there is code in between!
    if (view.state.doc.rangeHasMark(from, to, markType)) return false;
    const mark = markType.create();
    const tr = view.state.tr
      .delete(to - 1, to)
      .addMark(from, to - 1, mark)
      .addStoredMark(mark);
    view.dispatch(
      tr.setMeta(plugin, {
        transform: tr,
        from,
        to,
        text,
        action: 'add',
        pos: from,
      }),
    );
    return true;
  },
};

function run(view: EditorView, from: number, to: number, text: string, plugin: Plugin) {
  if (view.composing) return false;
  const { state } = view;
  const $from = state.doc.resolve(from);
  if ($from.parent.type.spec.code) return false;

  const leafText = '\ufffc';
  const textBefore =
    $from.parent.textBetween(
      Math.max(0, $from.parentOffset - MAX_MATCH),
      $from.parentOffset,
      undefined,
      leafText,
    ) + text;
  const textAfter =
    text +
    $from.parent.textBetween(
      $from.parentOffset,
      Math.min($from.parent.nodeSize - 2, $from.parentOffset + MAX_MATCH),
      undefined,
      leafText,
    );
  const matchB = markBefore.match.exec(textBefore);
  const matchA = markAfter.match.exec(textAfter);
  if (matchB) {
    const handled = markBefore.handler(
      view,
      text,
      matchB,
      from - matchB[0].length + text.length,
      to,
      plugin,
    );
    if (handled) return handled;
  }
  if (matchA)
    return markAfter.handler(view, text, matchA, from, to + matchA[0].length - text.length, plugin);
  return false;
}

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
      init: () => inactiveState,
      apply(tr, prev): CodemarkState | null {
        // const meta = tr.getMeta(plugin) as AutocompleteTrMeta;
        const meta = tr.getMeta(plugin);
        if (!meta?.action) {
          if (meta) return meta;
          return tr.selectionSet || tr.docChanged ? null : prev;
        }
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
          const selected = tr
            .setSelection(TextSelection.create(tr.doc, to))
            .removeStoredMark(mark)
            .setMeta(plugin, { action: 'add', pos: selection.to });
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
            view.dispatch(
              view.state.tr
                .removeStoredMark(mark)
                .setMeta(plugin, { action: 'add', pos: selection.from }),
            );
            return true;
          }
          if (
            (nextCode && !pluginState?.decorations && pos.parentOffset !== 0) ||
            (pos.parentOffset === 0 && pluginState?.side === -1)
          ) {
            // |`code` --> `|code`
            view.dispatch(
              view.state.tr
                .addStoredMark(mark.create())
                .setMeta(plugin, { action: 'add', pos: selection.from }),
            );
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
            view.dispatch(
              view.state.tr.addStoredMark(mark.create()).setMeta(plugin, { action: 'remove' }),
            );
            return true;
          }
          if (!inCode && pluginState?.decorations) {
            // `|code` --> |`code`
            view.dispatch(
              view.state.tr.removeStoredMark(mark).setMeta(plugin, { action: 'remove' }),
            );
            return true;
          }
          if (inCode === nextCode) return false;
          if ((nextCode || (!selection.empty && inCode)) && !pluginState?.decorations) {
            // `code`_|_ --> `code`|   nextCode
            // `code`███ --> `code`|   !selection.empty && inCode
            // `██de`___ --> `|code`   !selection.empty && nextCode
            const from = selection.empty ? selection.from - 1 : selection.from;
            const selected = view.state.tr
              .setSelection(TextSelection.create(doc, from))
              .setMeta(plugin, { action: 'add', pos: from });
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
            view.dispatch(
              view.state.tr
                .setSelection(TextSelection.create(doc, from))
                .removeStoredMark(mark)
                .setMeta(plugin, { action: 'add', pos: from }),
            );
            return true;
          }
          if (inCode && !pluginState?.decorations && selection.$from.parentOffset > 0) {
            // `c|ode` --> `|code`
            view.dispatch(
              view.state.tr
                .setSelection(TextSelection.create(doc, selection.from - 1))
                .addStoredMark(mark.create())
                .setMeta(plugin, { action: 'add', pos: selection.from - 1 }),
            );
            return true;
          }
          if (inCode && !pluginState?.decorations && selection.$from.parentOffset === 0) {
            // Start of line
            // ^`|code` --> ^|`code`
            view.dispatch(
              view.state.tr
                .removeStoredMark(mark)
                .setMeta(plugin, { action: 'add', pos: selection.from, side: -1 }),
            );
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
            view.dispatch(
              tr.removeStoredMark(mark).setMeta(plugin, { action: 'add', pos: tr.selection.from }),
            );
            return true;
          }
          if (tr.selection.$from.parentOffset === 0) {
            // ^███`code` --> `|ode`
            view.dispatch(
              tr
                .removeStoredMark(mark)
                .setMeta(plugin, { action: 'add', pos: tr.selection.from, side: -1 }),
            );
            return true;
          }
          if (inCode || nextCode) {
            // `c|ode` --> `|ode`
            // `██de` --> `|de`
            view.dispatch(
              tr
                .addStoredMark(mark.create())
                .setMeta(plugin, { action: 'add', pos: tr.selection.from }),
            );
            return true;
          }
        }
        return false;
      },
      handleTextInput(view, from, to, text) {
        return run(view, from, to, text, plugin);
      },
    },
  } as PluginSpec);
  return plugin;
}

export function codemark(opts: Options) {
  const { markType } = opts;
  const rules: Plugin[] = [getDecorationPlugin()];
  return rules;
}
