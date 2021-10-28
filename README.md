# `prosemirror-autocomplete`

[![prosemirror-autocomplete on npm](https://img.shields.io/npm/v/prosemirror-autocomplete.svg)](https://www.npmjs.com/package/prosemirror-autocomplete)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/curvenote/prosemirror-autocomplete/blob/master/LICENSE)
![CI](https://github.com/curvenote/prosemirror-autocomplete/workflows/CI/badge.svg)
[![demo](https://img.shields.io/badge/live-demo-blue)](https://curvenote.github.io/prosemirror-autocomplete/)

A plugin for [ProseMirror](https://prosemirror.net/) that adds triggers for `#hashtags`, `@mentions`, `/menus`, and other more complex autocompletions. The `prosemirror-autocomplete` library can be used to create suggestions similar to Notion, Google Docs or Confluence; it is created and used by [Curvenote](https://curvenote.com). The library does not provide a user interface beyond the [demo code](./demo/index.ts).

[![Autocomplete](./demo/autocomplete.gif)](https://curvenote.github.io/prosemirror-autocomplete/)

## Install

```bash
npm install prosemirror-autocomplete
```

Or see the [live demo here](https://curvenote.github.io/prosemirror-autocomplete/)!

## Overview

`prosemirror-autocomplete` allows you to have fine-grained control over an autocomplete suggestion, similar to an IDE but simple enough for `@` or `#` mentions.

```ts
import autocomplete, { Options, Arrow } from 'prosemirror-autocomplete';

const options: Options = {
  triggers: [
    { name: 'hashtag', trigger: '#' },
    { name: 'mention', trigger: '@' },
  ],
  onOpen: ({ view, range, trigger, type }) => handleOpen(),
  onClose: ({ view }) => handleClose(),
  onFilter: ({ view, filter }) => handleFilter(),
  onArrow: ({ view, kind }) => handleArrow(kind),
  onSelect: ({ view }) => handleSelect(),
  // use `reducer` to handle these in a single function!
};

const view = new EditorView(editor, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(content),
    plugins: [...autocomplete(options), ...otherPlugins],
  }),
});
```

The function `autocomplete` takes handlers or a single `reducer` and a list of `triggers`, it returns a two plugins: (1) a decoration plugin that wraps the input, and (2) a `InputRule` plugin that has a series of triggers that are defined in the options. All handlers take an `AutocompleteAction` as the first and only argument (same as the `reducer`).

- `onOpen({ view, range, trigger, filter, type })` — when the autocomplete should be opened
  - The `type` is the `Trigger` that cause this action
- `onClose({ view })` — called on escape, click away, or paste
- `onFilter({ view, filter })` — called when the user types, use this to filter the suggestions shown
- `onArrow({ view, kind })`
  - `kind` is one or `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`
  - left/right are only called if `allArrowKeys = true` for the trigger
- `onSelect({ view, range, filter })` — called on `Enter` or `Tab`

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

The library does not come with any user interface, you will have to do that when you get an action from the autocomplete plugin. You can either use the handlers `onOpen`, `onClose`, `onFilter`, `onArrow`, and `onSelect` or you can define a single reducer that will take over these responsibilities. Note: you cannot use handlers and a reducer.

```ts
import { AutocompleteAction, KEEP_OPEN } from 'prosemirror-autocomplete';

export function reducer(action: AutocompleteAction): boolean {
  switch (action.kind) {
    case ActionKind.open:
      handleSearch(action.search);
      placeSuggestion(true);
      return true;
    case ActionKind.select:
      // This is on Enter or Tab
      const { from, to } = action.range;
      const tr = action.view.state.tr.deleteRange(from, to).insertText('You can define this!');
      action.view.dispatch(tr);
      return true;
      // To keep the suggestion open after selecting:
      return KEEP_OPEN;
    case ActionKind.close:
      // Hit Escape or Click outside of the suggestion
      closeSuggestion();
      return true;
    case ActionKind.up:
      selectSuggestion(-1);
      return true;
    case ActionKind.down:
      selectSuggestion(+1);
      return true;
    default:
      return false;
  }
}
```

## Positioning a Suggestion

You can use something like [popper.js](https://popper.js.org/) to ensure that the suggestion stays in the right place on scroll or simply an abolutely positioned `<div>`.

```ts
import { DEFAULT_ID } from 'prosemirror-autocomplete';

function placeSuggestion(open: boolean) {
  suggestion.style.display = open ? 'block' : 'none';
  const rect = document.getElementById(DEFAULT_ID).getBoundingClientRect();
  suggestion.style.top = `${rect.top + rect.height}px`;
  suggestion.style.left = `${rect.left}px`;
}
```

If you don't want to use the `DEFAULT_ID` provided (which is `'autocomplete'`) then you can provide your own for any trigger:

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

This will allow you to specify styling of the wrapped decoration (which is a `<span>`). This can be different based on the trigger type.

## Related Projects

There are a few other packages that offer similar functionality:

- [prosemirror-suggestions](https://github.com/quartzy/prosemirror-suggestions)
- [prosemirror-mentions](https://github.com/joelewis/prosemirror-mentions)
- [prosemirror-suggest](https://github.com/remirror/remirror/tree/next/packages/prosemirror-suggest)

`prosemirror-suggestions` is similar in that it does not provide a UI, if you want a UI out of the box you can look at `prosemirror-mentions`. All three of these libraries trigger based on RegExp and leave the decorations in the state. This is similar to how Twitter works, but is undesirable in writing longer documents where you want to dismiss the suggestions with an escape and not see them again in that area.

This library, `prosemirror-autocomplete`, works based on an input rule and then a decoration around the chosen area meaning you can target the suggestion specifically and dismiss it with ease.

---

<p style="text-align: center; color: #aaa; padding-top: 50px">
  Made with love by
  <a href="https://curvenote.com" target="_blank" style="color: #aaa">
    <img src="https://curvenote.dev/images/icon.png" style="height: 1em" /> Curvenote
  </a>
</p>
