import { Plugin, PluginKey, Selection } from 'prosemirror-state';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

export const SUGGESTION_ID = 'suggestion';
export const KEEP_SELECTION_ALIVE = 'KEEP_SELECTION_ALIVE';

interface Range {
  from: number;
  to: number;
}

interface SuggestionState {
  active: boolean;
  trigger: string | null;
  decorations: DecorationSet;
  text: string | null;
  range: Range | null;
}
const inactiveSuggestionState = {
  active: false,
  trigger: null,
  decorations: DecorationSet.empty,
  text: null,
  range: null,
};

export const key = new PluginKey('suggestion');

export interface SuggestionMeta {
  action: 'add' | 'remove';
  trigger: string | null;
}

export function triggerSuggestion(view: EditorView, trigger: string, search?: string) {
  const plugin = key.get(view.state) as Plugin;
  const tr = view.state.tr
    .insertText(`${trigger}${search ?? ''}`)
    .scrollIntoView()
    .setMeta(plugin, { action: 'add', trigger, search } as SuggestionMeta);
  view.dispatch(tr);
}

export enum SuggestionActionKind {
  'open' = 'open',
  'close' = 'close',
  'filter' = 'filter',
  'previous' = 'previous',
  'next' = 'next',
  'select' = 'select',
}

export interface SuggestionAction {
  kind: SuggestionActionKind;
  view: EditorView;
  trigger: string;
  search: string | null;
  range: Range;
}

function actionFromEvent(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
      return SuggestionActionKind.previous;
    case 'ArrowDown':
      return SuggestionActionKind.next;
    case 'Tab':
      return SuggestionActionKind.select;
    case 'Enter':
      return SuggestionActionKind.select;
    case 'Escape':
      return SuggestionActionKind.close;
    default:
      return null;
  }
}

function inSuggestion(selection: Selection, decorations: DecorationSet) {
  return decorations.find(selection.from, selection.to).length > 0;
}

export function cancelSuggestion(view: EditorView) {
  const plugin = key.get(view.state) as Plugin;
  const { tr } = view.state;
  tr.setMeta(plugin, { action: 'remove', trigger: null } as SuggestionMeta);
  view.dispatch(tr);
  return true;
}

function cancelIfInsideAndPass(view: EditorView) {
  const plugin = key.get(view.state) as Plugin;
  const { decorations } = plugin.getState(view.state);
  if (inSuggestion(view.state.selection, decorations)) {
    cancelSuggestion(view);
  }
  return false;
}

export default function getPlugins(
  onAction: (action: SuggestionAction) => boolean | typeof KEEP_SELECTION_ALIVE = () => false,
  suggestionTrigger = /(?:^|\W)(@|#)$/,
  cancelOnFirstSpace: ((trigger: string | null) => boolean) | boolean = true,
  suggestionClass = 'suggestion',
  {
    triggersOnlyInSuggestion = false,
  }: {
    triggersOnlyInSuggestion: boolean; // to support mouse triggered suggestion. Probably split off to a sepserated piece of logic completely
  } = {
    triggersOnlyInSuggestion: false,
  },
) {
  const plugin: Plugin<SuggestionState> = new Plugin({
    key,
    view() {
      return {
        update: (view, prevState) => {
          const prev = plugin.getState(prevState);
          const next = plugin.getState(view.state);

          const started = !prev.active && next.active;
          const stopped = prev.active && !next.active;
          const changed =
            next.active &&
            !started &&
            !stopped &&
            (prev.text !== next.text || prev.trigger !== next.trigger);

          const action = {
            view,
            trigger: next.trigger ?? (prev.trigger as string),
            search: next.text ?? prev.text,
            range: next.range ?? (prev.range as Range),
          };

          if (started) onAction({ ...action, kind: SuggestionActionKind.open });
          if (changed) onAction({ ...action, kind: SuggestionActionKind.filter });
          if (stopped) onAction({ ...action, kind: SuggestionActionKind.close });
        },
      };
    },
    state: {
      init: () => ({ ...inactiveSuggestionState } as SuggestionState),
      apply(tr, state) {
        const meta = tr.getMeta(plugin);
        if (meta?.action === 'add') {
          const { trigger, search } = meta;
          const from = tr.selection.from - trigger.length - (search?.length ?? 0);
          const to = tr.selection.from;
          const deco = Decoration.inline(
            from,
            to,
            {
              id: SUGGESTION_ID,
              class: suggestionClass,
            },
            { inclusiveStart: false, inclusiveEnd: true },
          );
          return {
            active: true,
            trigger: meta.trigger,
            decorations: DecorationSet.create(tr.doc, [deco]),
            text: search,
            range: { from, to },
          };
        }
        const { active, trigger, decorations } = state;
        const nextDecorations = decorations.map(tr.mapping, tr.doc);
        const hasDecoration = nextDecorations.find().length > 0;
        // If no decoration, explicitly remove, or click somewhere else in the editor
        if (
          meta?.action === 'remove' ||
          !inSuggestion(tr.selection, nextDecorations) ||
          !hasDecoration
        )
          return { ...inactiveSuggestionState };

        // Ensure that the trigger is in the decoration
        const { from, to } = nextDecorations.find()[0];
        const text = tr.doc.textBetween(from, to);
        if (!text.startsWith(trigger as string)) return { ...inactiveSuggestionState };

        return {
          active,
          trigger,
          decorations: nextDecorations,
          text: text.slice(trigger?.length ?? 1),
          range: { from, to },
        };
      },
    },
    props: {
      decorations: (state) => plugin.getState(state).decorations,
      handlePaste: (view) => cancelIfInsideAndPass(view),
      handleDrop: (view) => cancelIfInsideAndPass(view),
      handleKeyDown(view, event) {
        const { trigger, active, decorations } = plugin.getState(view.state);
        if (!active) return false;
        if (triggersOnlyInSuggestion && !inSuggestion(view.state.selection, decorations))
          return false;

        let from;
        let to;
        const [deco] = decorations.find();
        if (deco) {
          ({ from, to } = deco);
        } else {
          from = view.state.selection.from;
          to = view.state.selection.to;
        }

        const text = view.state.doc.textBetween(from, to);

        const search = text.slice(trigger?.length ?? 1);

        const cancelOnSpace =
          typeof cancelOnFirstSpace === 'boolean'
            ? cancelOnFirstSpace
            : cancelOnFirstSpace(trigger);
        if (
          cancelOnSpace &&
          search.length === 0 &&
          (event.key === ' ' || event.key === 'Spacebar')
        ) {
          cancelSuggestion(view);
          return false;
        }

        const kind = actionFromEvent(event);
        const action = {
          view,
          trigger: trigger as string,
          search,
          range: { from, to },
        };
        switch (kind) {
          case SuggestionActionKind.close:
            // The user action will be handled in the view code above
            // Allows clicking off to be handled in the same way
            return cancelSuggestion(view);
          case SuggestionActionKind.select: {
            // Only trigger the cancel if it is not expliticly handled in the select
            const result = onAction({ ...action, kind: SuggestionActionKind.select });
            if (result === KEEP_SELECTION_ALIVE) {
              return true;
            }
            return result || cancelSuggestion(view);
          }
          case SuggestionActionKind.previous:
            return Boolean(onAction({ ...action, kind: SuggestionActionKind.previous }));
          case SuggestionActionKind.next:
            return Boolean(onAction({ ...action, kind: SuggestionActionKind.next }));
          default:
            break;
        }
        return false;
      },
    },
  });
  const rules: Plugin[] = [
    plugin,
    inputRules({
      rules: [
        new InputRule(suggestionTrigger, (state, match) => {
          const { decorations, active } = plugin.getState(state);
          if (inSuggestion(state.selection, decorations)) return null;
          // If we are currently suggesting, don't activate
          const tr = state.tr.insertText(match[1][match[1].length - 1]).scrollIntoView();
          tr.setMeta(plugin, { action: 'add', trigger: match[1] } as SuggestionMeta);
          return tr;
        }),
      ],
    }),
  ];
  return rules;
}
