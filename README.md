# `prosemirror-codemark`

[![prosemirror-codemark on npm](https://img.shields.io/npm/v/prosemirror-codemark.svg)](https://www.npmjs.com/package/prosemirror-codemark)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/curvenote/prosemirror-codemark/blob/master/LICENSE)
![CI](https://github.com/curvenote/prosemirror-codemark/workflows/CI/badge.svg)
[![demo](https://img.shields.io/badge/live-demo-blue)](https://curvenote.github.io/prosemirror-codemark/)

A plugin for [ProseMirror](https://prosemirror.net/) that handles manipulating and navigating inline code marks.
The plugin creates a fake cursor as necessary to show you if the next character you type will or will not be marked.
`prosemirror-codemark` is created and used by [Curvenote](https://curvenote.com).

[![Codemark](./demo/codemark.gif)](https://curvenote.github.io/prosemirror-codemark/)

## Install

```bash
npm install prosemirror-codemark
```

Or see the [live demo here](https://curvenote.github.io/prosemirror-codemark/)!

## Overview & Usage

`codemark` is a specialized `InputRule` and a `Plugin` to display a fake-cursor as a decoration, which allows you to navigate inside and outside of inline code. This allows the user the ability to navigate out of a code-mark, and also ensures that the text-input `caret` indicates what will happen next. The plugin works with `undoInputRule` from `prosemirror-inputrules` to undo code mark creation.

To use the plugins, supply your `MarkType` and use the plugins in your `EditorView`.

```ts
import codemark from 'prosemirror-codemark';
import 'codemark/dist/codemark.css';

const plugins = codemark({ markType: schema.marks.code });

const view = new EditorView(editor, {
  state: EditorState.create({
    doc,
    plugins: [...plugins, ...otherPlugins],
  }),
});
```

The styles are necessary to show the `.fake-cursor`, they are simple if you want to [override them](./src/codemark.css). It does not provide styles for the `code` specifically. The plugin visually works best if the code mark has a border and a different color than the main text.

## Why

One of the biggest frustrations in using what you see is what you get (WYSIWYG) editors when coming from knowing `Markdown` is how they deal with inline code. In Markdown this is easy, you simply wrap a word in back-ticks (e.g. `` `code` ``). In many ways, the other “marks”, like bold, italic, underline are all easier in applications like Word, Notion, Confluence, etc. because almost everyone knows the shortcut to make something stop being bold/italic/underlined. This is **not the case** for code-marks, which act similarly, however there is no common/shared shortcut to remove a code-mark, and every editor application does something subtly different.

If you are using Slack or Notion, try creating a code block and then adding something to the start or end **after** it is created. The behaviour is completely unintuitive, you often have no idea if the next character you type will be inside or outside of the code-mark, and in Notion, for example, this changes based on if you hit backspace!

![Notion](./demo/notion.gif)

In Slack, if you start a message with code, there is literally no way to exit the code at the start without using your mouse, deleting the code-mark completely, or knowing the keyboard shortcut. In Slack, the right arrow key also mysteriously turns into a spacebar at the end of the code-mark or feels like it skips one character ahead.

![Slack](./demo/slack.gif)

The ambiguity of whether the next character you type will be “marked” is something that we tolerate for bold/italics/underline — because we all know the escape hatch and don’t have to leave our keyboards. But if you learn the keyboard shortcut for code in Slack, you might be surprised when you use it in Notion that the developer tools in Chrome pop up. Or say you learn the shortcut in Confluence, and jump over to Slack you will open your Mentions — in Notion, it creates a comment! Notion as far as I can tell, doesn’t even have a shortcut for a code-mark.

There are so many other quirks in these applications with regard to how the spacebar, or arrow keys work, how to deal with one-character of code. I have yet to see a WYSIWYG editor actually do it “right”.

Our goal at [Curvenote](https://curvenote.com) is to make a best-in-class editing experience for technical content, and these are the types of details you either never notice because it just works, or they make people tear their hair out.

## Why is this hard?

Browsers `contenteditable` DOM doesn't distinguish between a cursor positions inside and outside inline tags when it comes to where to insert text. This state is held by the application for what to insert next (in ProseMirror these are `storedMarks`, which can be added or removed). This means that visually distinguishing the first two states in the next figure is not possible.

![Legend](./demo/legend.png)

Various approaches can be taken, and Chrome seems to default to if you are on the left you are outside the mark, if you are on the right you are inside. This can make the default experience quite confusing. Other browsers deal with this differently again.

## Our Approach

We are using ProseMirror and providing two plugins that handle a specialized `InputRule` (forwards and backwards lookup); and a `Decoration` plugin that displays a cursor in the correct location indicating if your next character you type will be marked or not.

This is something that can be done a few ways, we tried a `&ZeroWidthSpace;`, but couldn't get that to be reliable as a decoration and did not want to add to the document state when changing selections. Instead, we added a simple `span.fake-cursor` that blinks, has a border, and no-width. For this to work correctly, the `EditorView` briefly makes the default caret transparent when the fake cursor is visible. This cursor is removed when it is not needed.

The plugin also provides specialized handling for navigation events (arrows, backspace, etc.), and we have provided a way to exit the code mark using the arrow keys. This defaults to a mental model of the code-mark is wrapped in backticks when you are navigating. The cursor always moves when you press the arrow key, even though the position in the ProseMirror document does not, instead it toggles on/off a `storedMark`.

We have also added handlers for jumping between words, to the start & end of line, as well as between lines. These take you outside of the code mark if appropriate.

## Code mark creation

- `` `code| → `code`| `` (create remain outside)
- `` |code` → `|code` `` (create remain inside)
- `` ████ → `code` `` (selected and press `` ` ``)
- Inserting `` ` `` around an existing code marks does nothing

## Enter and Exit

Holding down the arrow key or word/line modifiers should continue to work as expected.

### Right Arrow:

- `` `code|` → `code`| `` (exit)
- `` |`code` → `|code` `` (enter)
- `` `co██|` → `code|` `` (selected remains inside)
- `` ██|`code` → __|`code` `` (selected remains outside)
- `` `code`|$ → `code`$| `` (exit end of line)
- `` |^`code` → ^|`code` `` --> (enter line, remain outside)

### Left Arrow:

- `` `code`| → `code|` `` (enter)
- `` `|code` → |`code` `` (exit)
- `` ^`|code` → ^|`code` `` (exit at top of paragraph)
- `` ^|`code` → |^`code` `` (exit line)
- `` `code`|██ → `code`|__ `` (selected remains outside)
- `` `|██de` → `|code` `` (selected remains inside)
- `` `code`$| → `code`|$ `` (enter line, remain outside)

### Home & End

- Commands `ctrl-a`, `cmd-left`, and `Home` should jump to start, without mark
- Commands `ctrl-e`, `cmd-right`, and `End` should jump to end, without mark

### Up & Down

When navigating between lines, default to outside of the codemark if there is a choice.

### Backspace:

- `` `code`x| → `code`| `` (delete, remain outside)
- `` `code`|██ → `code`| `` (delete selected, remain outside)
- `` `c|ode` → `|ode` `` (delete, remain inside)
- `` `|██de` → `|de` `` (delete selected, remain inside)
- TODO: `` `|████` → | `` (delete full mark, next insertion normal)

### Delete:

- TODO!

### Clicking

- Default to outside of the code mark when clicking to a new location in the editor

## Browser compatibility

The plugin works great for Chrome at the moment and is pretty solid in Firefox, Safari has different display for where it puts the cursors before a span, so that needs some work.

---

<p style="text-align: center; color: #aaa; padding-top: 50px">
  Made with love by
  <a href="https://curvenote.com" target="_blank" style="color: #aaa">
    <img src="https://curvenote.dev/images/icon.png" style="height: 1em" /> Curvenote
  </a>
</p>
