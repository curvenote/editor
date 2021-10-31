import { MarkType } from 'prosemirror-model';
import { Plugin, PluginSpec, TextSelection, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MAX_MATCH } from './utils';

type InputRuleState = {
  transform: Transaction;
  from: number;
  to: number;
  text: string;
} | null;

type Plugins = { input: Plugin; cursor: Plugin };

type Handler = (
  state: EditorView,
  text: string,
  match: RegExpExecArray,
  from: number,
  to: number,
  plugin: Plugins,
) => boolean;

type Rule = {
  match: RegExp;
  handler: Handler;
};

const markBefore: Rule = {
  match: /`((?:[^`\w]|[\w])+)`$/,
  handler: (view, text, match, from, to, plugins) => {
    const markType = view.state.schema.marks.code as MarkType;
    // Don't create it if there is code in between!
    if (view.state.doc.rangeHasMark(from, to, markType)) return false;
    const code = match[1];
    const mark = markType.create();
    const pos = from + code.length;
    const tr = view.state.tr.delete(from, to).insertText(code).addMark(from, pos, mark);
    const selected = tr
      .setSelection(TextSelection.create(tr.doc, pos))
      .removeStoredMark(markType)
      .setMeta(plugins.cursor, {
        action: 'add',
        pos,
      });
    const withMeta = selected.setMeta(plugins.input, {
      transform: selected,
      from,
      to,
      text: `\`${code}${text}`,
    });
    view.dispatch(withMeta);
    return true;
  },
};

const markAfter: Rule = {
  match: /^`((?:[^`\w]|[\w])+)`/,
  handler: (view, text, match, from, to, plugins) => {
    const markType = view.state.schema.marks.code as MarkType;
    // Don't create it if there is code in between!
    if (view.state.doc.rangeHasMark(from, to, markType)) return false;
    const mark = markType.create();
    const code = match[1];
    const pos = from;
    const tr = view.state.tr
      .delete(from, to)
      .insertText(code)
      .addMark(from, from + code.length, mark);
    const selected = tr
      .setSelection(TextSelection.create(tr.doc, pos))
      .addStoredMark(markType.create())
      .setMeta(plugins.cursor, {
        action: 'add',
        pos,
      });
    const withMeta = selected.setMeta(plugins.input, {
      transform: selected,
      from,
      to,
      text: `\`${code}${text}`,
    });
    view.dispatch(withMeta);
    return true;
  },
};

function run(view: EditorView, from: number, to: number, text: string, plugins: Plugins) {
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
      plugins,
    );
    if (handled) return handled;
  }
  if (matchA)
    return markAfter.handler(
      view,
      text,
      matchA,
      from,
      to + matchA[0].length - text.length,
      plugins,
    );
  return false;
}

export function createInputRule(cursorPlugin: Plugin) {
  const plugin: Plugin<InputRuleState> = new Plugin({
    isInputRules: true,
    state: {
      init: () => null,
      apply(tr, prev) {
        const meta = tr.getMeta(plugin);
        if (meta) return meta;
        return tr.selectionSet || tr.docChanged ? null : prev;
      },
    },
    props: {
      handleTextInput(view, from, to, text) {
        return run(view, from, to, text, { input: plugin, cursor: cursorPlugin });
      },
    },
  } as PluginSpec);
  return plugin;
}
