# `prosemirror-codemark`

[![prosemirror-codemark on npm](https://img.shields.io/npm/v/prosemirror-codemark.svg)](https://www.npmjs.com/package/prosemirror-codemark)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/curvenote/prosemirror-codemark/blob/master/LICENSE)
![CI](https://github.com/curvenote/prosemirror-codemark/workflows/CI/badge.svg)

A plugin for [ProseMirror](https://prosemirror.net/) that adds triggers for `#hashtags`, `@mentions`, `/menus`, and other more complex autocompletions. The `prosemirror-codemark` library can be used to create suggestions similar to Notion, Google Docs or Confluence; it is created and used by [Curvenote](https://curvenote.com). The library does not provide a user interface beyond the [demo code](./demo/index.ts).

[![Autocomplete](./demo/codemark.gif)](https://curvenote.github.io/prosemirror-codemark/)

## Install

```bash
npm install prosemirror-codemark
```

Or see the [live demo here](https://curvenote.github.io/prosemirror-codemark/)!

## Overview

- Codemark is a specialized `InputRule` with a plugin to allow you to navigate inside and outside of inline code and insure that the cursor shows you what will happen.
- TODO: Works with `undoInputRule` from `prosemirror-inputrules`

## Code mark creation

- `` `code| → `code`| `` (create remain outside)
- `` |code` → `|code` `` (create remain inside)

* `` ████ → `code` `` (selected and press `` ` ``)
* Inserting `` ` `` around a code mark should not work

## Enter and Exit

### Right Arrow:

- `` `code|` → `code`| `` (exit)
- `` |`code` → `|code` `` (enter)
- `` `co██|` → `code|` `` (selected remains inside)
- `` ██|`code` → __|`code` `` (selected remains outside)
- `` `code`|$ → `code`$| `` (exit end of line)
- TODO: `` |^`code` → ^|`code` `` --> (enter line, remain outside)
- Hold arrow
- Modifiers right ctrl-e / cmd-right should jump to end, no mark
- Modifiers, uneffected

### Left Arrow:

- `` `code`| → `code|` `` (enter)
- `` `|code` → |`code` `` (exit)
- `` ^`|code` → ^|`code` `` (exit at top of paragraph)
- `` ^|`code` → |^`code` `` (exit line)
- `` `code`|██ → `code`|__ `` (selected remains outside)
- `` `|██de` → `|code` `` (selected remains inside)
- TODO: `` `code`$| → `code`|$ `` (enter line, remain outside)
- Modifiers let ctrl-a / cmd-left should jump to start, no mark

* [ ] code at top of line, left/right/left doesn't work

### Backspace:

- `` `code`x| → `code`| `` (delete, remain outside)
- `` `code`|██ → `code`| `` (delete selected, remain outside)
- `` `c|ode` → `|ode` `` (delete, remain inside)
- `` `|██de` → `|de` `` (delete selected, remain inside)
- TODO: `` `|████` → | `` (delete full mark, next insertion normal)

### Delete:

- TODO!

---

<p style="text-align: center; color: #aaa; padding-top: 50px">
  Made with love by
  <a href="https://curvenote.com" target="_blank" style="color: #aaa">
    <img src="https://curvenote.dev/images/icon.png" style="height: 1em" /> Curvenote
  </a>
</p>
