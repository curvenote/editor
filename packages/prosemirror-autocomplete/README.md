# `prosemirror-autocomplete`

[![prosemirror-autocomplete on npm](https://img.shields.io/npm/v/prosemirror-autocomplete.svg)](https://www.npmjs.com/package/prosemirror-autocomplete)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/curvenote/prosemirror-autocomplete/blob/master/LICENSE)
![CI](https://github.com/curvenote/prosemirror-autocomplete/workflows/CI/badge.svg)
[![demo](https://img.shields.io/badge/live-demo-blue)](https://curvenote.github.io/prosemirror-autocomplete/)

A plugin for [ProseMirror](https://prosemirror.net/) that adds triggers for `#hashtags`, `@mentions`, `/menus`, and other more complex autocompletions. The `prosemirror-autocomplete` library can be used to create suggestions similar to Notion, Google Docs or Confluence; it is created and used by [Curvenote](https://curvenote.com). The library does not provide a user interface beyond the [demo code](./demo/index.ts).

[![Autocomplete](https://github.com/curvenote/editor/raw/main/packages/prosemirror-autocomplete/demo/autocomplete.gif)](https://curvenote.github.io/prosemirror-autocomplete/)

## Install

```bash
npm install prosemirror-autocomplete
```

Or see the [live demo here](https://curvenote.github.io/prosemirror-autocomplete/)!

## Overview

`prosemirror-autocomplete` allows you to have fine-grained control over an autocomplete suggestion, similar to an IDE but simple enough for `@` or `#` mentions.

```ts
import autocomplete, { Options } from 'prosemirror-autocomplete';

// Create autocomplete with triggers and specified handers:
const options: Options = {
  triggers: [
    { name: 'hashtag', trigger: '#' },
    { name: 'mention', trigger: '@' },
  ],
  onOpen: ({ view, range, trigger, type }) => handleOpen(),
  onArrow: ({ view, kind }) => handleArrow(kind),
  onFilter: ({ view, filter }) => handleFilter(),
  onEnter: ({ view }) => handleSelect(),
  onClose: ({ view }) => handleClose(),
};

// Alternatively, use a single reducer to handle all actions:
const options: Options = {
  triggers: [
    { name: 'hashtag', trigger: '#' },
    { name: 'mention', trigger: '@' },
  ],
  reducer: (action) => dispatch(action),
};

// Then add these plugins to the EditorView as normal in ProseMirror
const view = new EditorView(editor, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(content),
    plugins: [...autocomplete(options), ...otherPlugins],
  }),
});
```

The function `autocomplete` takes handlers or a single `reducer` and a list of `triggers`, it returns a two plugins:

1. a decoration plugin that wraps the trigger and filter text (e.g. `[@][mention]`); and
2. an `InputRule` plugin that has a series of triggers that are defined in the options.

All handlers take an `AutocompleteAction` as the first and only argument (same as the `reducer`).

- `onOpen({ view, range, trigger, filter, type })` — when the autocomplete should be opened
  - The `type` is the `Trigger` that cause this action
- `onEnter({ view, range, filter })` — called on `Enter` or `Tab`
- `onArrow({ view, kind })`
  - `kind` is one or `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`
  - left/right are only called if `allArrowKeys = true` for the trigger
- `onFilter({ view, filter })` — called when the user types, use this to filter the suggestions shown
- `onClose({ view })` — called on escape, click away, or paste

To use a `reducer` instead of distinct handlers, use the option `reducer: (action: AutocompleteAction) => boolean`, which will be used in place of the above handler functions.

## Defining a Trigger

By default, each Trigger has a `name`, and a `trigger`, which is a `string` or `RegExp`. For example, a simple trigger can just use a single string:

```ts
import type { Trigger } from 'prosemirror-autocomplete';

const mentionTrigger: Trigger = { name: 'mention', trigger: '@' };
```

This trigger gets wrapped in a regular expresion:

```ts
const equivalentTrigger = /(?:^|\s|\n|[^\d\w])(@)$/;
```

This does what you want most of the time, ensuring that you don't trigger when writing an email, or if you are writing something else. This is a bit more strict than you might want for a social plugin, which picks up hashtags or mentions anywhere you write them.

If you want this to come up all the time, try:

```ts
const peskyMentionTrigger: Trigger = { name: 'mention', trigger: /(@)$/ };
```

Provide the trigger in the matched group and anything before in a non-capture group (`(?:)`), this will help you split the action into a `action.search` and an `action.trigger`.

### Trigger Options

- `name: string`: the trigger is passed in the action, you can use this to descriminate handler calls
- `trigger: string | RegExp`: used to trigger an autocomplete suggestion - described above
- `cancelOnFirstSpace?: boolean`, cancels the auto complete on first space, default is true
- `allArrowKeys?: boolean`: Use left/right arrow keys, default is false
- `decorationAttrs?: DecorationAttrs`, passed to the `<span>` element directly through prosemirror

## Defining a Reducer

The library does not provide a user interface beyond the [demo code](./demo/index.ts), you will have to do that when you get an action from the autocomplete plugin. You can _either_ use the handlers `onOpen`, `onArrow`, `onFilter`, `onEnter`, and `onClose` _or_ you can define a single reducer that will take over these responsibilities. Note: you cannot use handlers and a reducer.

```ts
import { AutocompleteAction, KEEP_OPEN } from 'prosemirror-autocomplete';

export function reducer(action: AutocompleteAction): boolean | KEEP_OPEN {
  switch (action.kind) {
    case ActionKind.open:
      handleSearch(action.search);
      placeSuggestion(true);
      return true;
    case ActionKind.up:
      selectSuggestion(-1);
      return true;
    case ActionKind.down:
      selectSuggestion(+1);
      return true;
    case ActionKind.filter:
      filterSuggestions(action.filter);
      return true;
    case ActionKind.enter:
      // This is on Enter or Tab
      const { from, to } = action.range;
      const tr = action.view.state.tr
        .deleteRange(from, to) // This is the full selection
        .insertText('You can define this!'); // This can be a node view, or something else!
      action.view.dispatch(tr);
      return true;
      // To keep the suggestion open after selecting:
      return KEEP_OPEN;
    case ActionKind.close:
      // Hit Escape or Click outside of the suggestion
      closeSuggestion();
      return true;
    default:
      return false;
  }
}
```

An `AutocompleteAction` is passed to both the reducer and each handler has the following structure:

```ts
export type AutocompleteAction = {
  kind: ActionKind; // open, ArrowUp, ArrowDown, filter, enter, close
  view: EditorView; // the view that the plugin came from
  trigger: string; // This is the string that triggered the suggestion
  filter?: string; // This is the search string
  range: FromTo; // { from: number; to: number }, use to delete the selection
  type: Trigger | null; // This is the trigger object passed in
};
```

## Positioning & Styling

You can use something like [popper.js](https://popper.js.org/) to ensure that the autocomplete suggestions stay in the right place on scroll or simply an abolutely positioned `<div>` in some cases is sufficient.

```ts
function placeSuggestion(open: boolean) {
  suggestion.style.display = open ? 'block' : 'none';
  const rect = document.getElementsByClassName('autocomplete')[0].getBoundingClientRect();
  suggestion.style.top = `${rect.top + rect.height}px`;
  suggestion.style.left = `${rect.left}px`;
}
```

If you don't want to use the class provided (which is `'autocomplete'`) or have multiple on the page, then you can provide your own for any trigger:

```ts
const options: Options = {
  handler: reducer,
  triggers: [
    {
      name: 'command',
      trigger: '/',
      decorationAttrs: { id: 'myId', class: 'myClass' },
    },
  ],
};
```

This will allow you to specify styling of the wrapped decoration (which is a `<span>`). This can be different based on the trigger type. For example, in the above example you can use a css rule to style the inline span, this is what is done in [the demo](./demo/index.html):

```css
/* The default decoration class. Override with `decorationAttrs: { class: 'myClass' }` */
.autocomplete {
  border: 1px solid #333;
  border-radius: 2px 2px 0 0;
  border-bottom-color: white;
  padding: 2px 5px;
  color: blue;
}
```

## Triggering Autocomplete without an `InputRule`

There are certain times when you want to open up an autocomplete suggestion without the user typing. For example, you might have a command menu under `/` that shows all commands for users to discover other triggers, where they can discover `/emoji` and then the UI should move them into an emoji selection or `:`.

There are two actions:

```ts
import { openAutocomplete, closeAutocomplete } from 'prosemirror-autocomplete';
```

- `openAutocomplete(view: EditorView, trigger: string, filter?: string)`
- `closeAutocomplete(view: EditorView)`

If the above scenario, the user would trigger an input rule for the first action by typing `/emoji` and then the `onEnter` or `reducer` would call `closeAutocomplete(view)` and then `openAutocomplete(view, ':', 'rocket')`, optional 🚀 obviously!

## Related Projects

There are a few other packages that offer similar functionality:

- [prosemirror-suggestions](https://github.com/quartzy/prosemirror-suggestions)
- [prosemirror-mentions](https://github.com/joelewis/prosemirror-mentions)
- [prosemirror-suggest](https://github.com/remirror/remirror/tree/next/packages/prosemirror-suggest)
- [@tiptap/suggestion](https://www.npmjs.com/package/@tiptap/suggestion)

`prosemirror-suggestions` is similar in that it does not provide a UI, if you want a simple UI out of the box you can look at `prosemirror-mentions`. All three of these libraries trigger based on RegExp and leave the decorations in the state. This is similar to how Twitter works, but is undesirable in writing longer documents where you want to dismiss the suggestions with an escape and not see them again in that area.

This library, `prosemirror-autocomplete`, works based on an input rule and then a decoration around the chosen area meaning you can target the suggestion specifically and dismiss it with ease.

---

<p style="text-align: center; color: #aaa; padding-top: 50px">
  Made with love by
  <a href="https://curvenote.com" target="_blank" style="color: #aaa">
    <img src="https://curvenote.dev/images/icon.png" style="height: 1em" /> Curvenote
  </a>
</p>
