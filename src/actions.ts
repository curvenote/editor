import { MarkType } from 'prosemirror-model';
import { Plugin, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CodemarkState, CursorMetaTr } from './types';
import { MAX_MATCH } from './utils';

export function stepOutsideNextTrAndPass(view: EditorView, plugin: Plugin): boolean {
  const meta: CursorMetaTr = { action: 'next' };
  view.dispatch(view.state.tr.setMeta(plugin, meta));
  return false;
}

export function onBacktick(
  view: EditorView,
  plugin: Plugin,
  event: KeyboardEvent,
  markType: MarkType,
): boolean {
  if (view.state.selection.empty) return false;
  if (event.metaKey || event.shiftKey || event.altKey || event.ctrlKey) return false;
  // Create a code mark!
  const { from, to } = view.state.selection;
  if (to - from >= MAX_MATCH || view.state.doc.rangeHasMark(from, to, markType)) return false;
  const tr = view.state.tr.addMark(from, to, markType.create());
  const meta: CursorMetaTr = { action: 'add', pos: to };
  const selected = tr
    .setSelection(TextSelection.create(tr.doc, to))
    .removeStoredMark(markType)
    .setMeta(plugin, meta);
  view.dispatch(selected);
  return true;
}

function onArrowRightInside(
  view: EditorView,
  plugin: Plugin,
  event: KeyboardEvent,
  markType: MarkType,
): boolean {
  if (event.metaKey) return stepOutsideNextTrAndPass(view, plugin);
  if (event.shiftKey || event.altKey || event.ctrlKey) return false;
  const { selection, doc } = view.state;
  if (!selection.empty) return false;
  const pluginState = plugin.getState(view.state) as CodemarkState;
  const pos = selection.$from;
  const inCode = !!markType.isInSet(pos.marks());
  const nextCode = !!markType.isInSet(pos.marksAcross(doc.resolve(selection.from + 1)) ?? []);
  if (inCode === nextCode && pos.parentOffset !== 0) return false;
  if (inCode && !pluginState?.decorations && pos.parentOffset !== 0) {
    // `code|` --> `code`|
    const meta: CursorMetaTr = { action: 'add', pos: selection.from };
    view.dispatch(view.state.tr.removeStoredMark(markType).setMeta(plugin, meta));
    return true;
  }
  if (
    (nextCode && !pluginState?.decorations && pos.parentOffset !== 0) ||
    (pos.parentOffset === 0 && pluginState?.side === -1)
  ) {
    // |`code` --> `|code`
    const meta: CursorMetaTr = { action: 'add', pos: selection.from };
    view.dispatch(view.state.tr.addStoredMark(markType.create()).setMeta(plugin, meta));
    return true;
  }
  return false;
}

export function onArrowRight(
  view: EditorView,
  plugin: Plugin,
  event: KeyboardEvent,
  markType: MarkType,
): boolean {
  const handled = onArrowRightInside(view, plugin, event, markType);
  if (handled) return true;
  const { selection } = view.state;
  const pos = selection.$from;
  if (selection.empty && pos.parentOffset === pos.parent.nodeSize - 2) {
    return stepOutsideNextTrAndPass(view, plugin);
  }
  return false;
}

function onArrowLeftInside(
  view: EditorView,
  plugin: Plugin,
  event: KeyboardEvent,
  markType: MarkType,
): boolean {
  if (event.metaKey) return stepOutsideNextTrAndPass(view, plugin);
  if (event.shiftKey || event.altKey || event.ctrlKey) return false;
  const { selection, doc } = view.state;
  const pluginState = plugin.getState(view.state) as CodemarkState;
  const inCode = !!markType.isInSet(selection.$from.marks());
  const nextCode = !!markType.isInSet(
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
    view.dispatch(view.state.tr.addStoredMark(markType.create()).setMeta(plugin, meta));
    return true;
  }
  if (!inCode && pluginState?.decorations) {
    // `|code` --> |`code`
    const meta: CursorMetaTr = { action: 'remove' };
    view.dispatch(view.state.tr.removeStoredMark(markType).setMeta(plugin, meta));
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
      view.dispatch(selected.addStoredMark(markType.create()));
    } else {
      view.dispatch(selected.removeStoredMark(markType));
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
        .removeStoredMark(markType)
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
        .addStoredMark(markType.create())
        .setMeta(plugin, meta),
    );
    return true;
  }
  if (inCode && !pluginState?.decorations && selection.$from.parentOffset === 0) {
    // Start of line
    // ^`|code` --> ^|`code`
    const meta: CursorMetaTr = { action: 'add', pos: selection.from, side: -1 };
    view.dispatch(view.state.tr.removeStoredMark(markType).setMeta(plugin, meta));
    return true;
  }
  return false;
}

export function onArrowLeft(
  view: EditorView,
  plugin: Plugin,
  event: KeyboardEvent,
  markType: MarkType,
): boolean {
  const handled = onArrowLeftInside(view, plugin, event, markType);
  if (handled) return true;
  const { selection } = view.state;
  const pos = selection.$from;
  if (selection.empty && pos.parentOffset === 0) {
    return stepOutsideNextTrAndPass(view, plugin);
  }
  return false;
}

export function onBackspace(
  view: EditorView,
  plugin: Plugin,
  event: KeyboardEvent,
  markType: MarkType,
): boolean {
  if (event.metaKey || event.shiftKey || event.altKey || event.ctrlKey) return false;
  const { selection, doc } = view.state;
  if (selection.empty && selection.$from.parentOffset === 0) {
    // No override at the start of the line!
    return false;
  }
  const inCode = !!markType.isInSet(selection.$from.marks());
  const nextCode = !!markType.isInSet(
    doc.resolve(selection.empty ? selection.from - 1 : selection.from + 1).marks() ?? [],
  );
  const plusCode = !!markType.isInSet(
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
    view.dispatch(tr.removeStoredMark(markType).setMeta(plugin, meta));
    return true;
  }
  if (tr.selection.$from.parentOffset === 0) {
    // ^███`code` --> `|ode`
    const meta: CursorMetaTr = { action: 'add', pos: tr.selection.from, side: -1 };
    view.dispatch(tr.removeStoredMark(markType).setMeta(plugin, meta));
    return true;
  }
  if (inCode || nextCode) {
    // `c|ode` --> `|ode`
    // `██de` --> `|de`
    const meta: CursorMetaTr = { action: 'add', pos: tr.selection.from };
    view.dispatch(tr.addStoredMark(markType.create()).setMeta(plugin, meta));
    return true;
  }
  return false;
}

export function stepOutside(view: EditorView, plugin: Plugin, markType: MarkType): void {
  const { selection, doc } = view.state;
  if (!selection.empty) return;
  const inCode = !!markType.isInSet(selection.$from.marks());
  if (!inCode) return;
  const nextCode = !!markType.isInSet(doc.resolve(selection.from + 1).marks() ?? []);
  const prevCode = !!markType.isInSet(doc.resolve(selection.from - 1).marks() ?? []);
  let meta: CursorMetaTr | null = null;
  if (!nextCode) {
    // `code|` --> `code`|
    meta = { action: 'add', pos: selection.from };
  } else if (!prevCode) {
    // `|code` --> |`code`
    meta = { action: 'add', pos: selection.from, side: -1 };
  }
  if (meta) {
    const tr = view.state.tr.removeStoredMark(markType).setMeta(plugin, meta);
    view.dispatch(tr);
  }
}
