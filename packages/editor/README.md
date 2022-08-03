# @curvenote/editor

[![@curvenote/editor on npm](https://img.shields.io/npm/v/@curvenote/editor.svg)](https://www.npmjs.com/package/@curvenote/editor)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/curvenote/editor/blob/main/LICENSE)
![CI](https://github.com/curvenote/editor/workflows/CI/badge.svg)
[![demo](https://img.shields.io/badge/live-demo-blue)](https://curvenote.github.io/editor/)

An interactive scientific editor built with [ProseMirror](https://prosemirror.net/), [React](http://reactjs.org/) and [Redux](https://redux.js.org/) - by [Curvenote](https://curvenote.com).

![@curvenote/editor in curvenote.com](https://github.com/curvenote/editor/raw/main/packages/editor/images/editor.gif)

## Why

We think that creating beautiful reactive documents and explorable explanations should be easy. Writing technical documents is hard enough already, and choosing to make that writing interactive is beyond the reach or time-commitment of most communicators.

We aim to lower the barriers to _writing_ computational narratives. Today, _narrative_ is often moved out of computational notebooks into _static_ document creation tools (Microsoft Word, Google Docs, LaTeX, Slides/PPT).

We think this is for two reasons:

1. The need for more expressive components, formatting or referencing.
   - [CommonMark](https://commonmark.org/) markdown does not support, for example, citations, cross-references, and even simple formatting like callouts (see various alternatives below).
2. To enable collaborators and reviewers who don't use these tools (e.g. when writing and reviewing papers & reports, slide decks, etc.)
   - Writing often requires collaborators that may not be comfortable with some combination of the tools required for computational narratives (e.g. git, md, notebooks, javascript, etc.).

## Goals

`@curvenote/editor` aims to bridge the gap between expressiveness and writing accessibility by developing a rich, [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG), collaborative editor with a focus on interactivity that integrates with LaTeX, various flavours of Markdown, and the Jupyter and Sphinx ecosystems.

## Overlap with [Curvenote](https://curvenote.com)

`@curvenote/editor` is the editor that is used in [Curvenote](https://curvenote.com), which is a scientific writing platform that connects to Jupyter.

## Architecture

- Basic prosemirror, wrapped in a React component with some middleware in Redux.
- Chosen to have many "blocks" of the editor on a page at once. See the UI in [Curvenote](https://curvenote.com) as to what we are supporting - inspired in part by [Jupyter](https://jupyter.org/).
  - If you only need one editor on the page, the weird part will be integrating with Redux, and some unnecessary indexing. However, this is probably important anyways if you have comments or other places in the DOM that are instances of the editor.
- Typescript and fully typed.
- Styling of editor components with [material-ui](https://material-ui.com)
- Reactivity powered by `@curvenote/components` and `@curvenote/runtime`, which are [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).
- Real-time collaboration is possible through middleware integrations. See [prosemirror-collab](https://github.com/ProseMirror/prosemirror-collab).
  - We will (eventually) improve support for cursors and highlights. See Roadmap.
- See [demo/index.tsx](/demo/index.tsx) for an example setup.

## Getting Started

```
git clone git@github.com:curvenote/editor.git
cd editor
npm install
npm run start
```

See the [demo folder](/demo/index.tsx) from more details on how to get started.
