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

`@curvenote/editor` is the editor that is used in [Curvenote](https://curvenote.com), a scientific writing platform that connects to Jupyter.

## Alternatives

There are _many_ Markdown syntax variants and extensions (e.g. [RMarkdown](https://rmarkdown.rstudio.com/), [MyST Markdown](https://spec.myst.tools), [idyll-lang](https://idyll-lang.org/), [MDX](https://mdxjs.com/)) that add flavours (usually) on top of [CommonMark](https://commonmark.org/) to allow for more complex documents and various degrees of interactivity. These syntaxes or development environments are often beyond the reach of many contributors and collaborative editing and review is often difficult.

### Interactivity

We think the best explanations are [explorable](http://explorabl.es/) and promote [_active_ reading](http://worrydream.com/ExplorableExplanations/), and would love to see this style of writing more widely adopted in scientific teaching, writing and education. To us, that means deep integrations with the Jupyter ecosystem and providing ways to support traditional export as well.

## Scope of Repository

A [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) editor for technical content and documents (papers, reports, documentation, etc.), and support computational into the narrative (c.f. [explorable explanations](http://worrydream.com/ExplorableExplanations/)).

**Specifically:**

- A stand alone scientific editor that can be integrated into other applications, [React](http://reactjs.org/) will be supported first-class.
- Integration points for collaboration, citations, and interactivity/reactivity.
- Prosemirror plugins for technical writing, comments, etc.

### Monorepo

The editor package is a monorepo that is built with turborepo. Included in this repository are:

- [`@curvenote/schema`](https://github.com/curvenote/schema) - the schema for this editor, focused on interactive content, also deals with translation and export.
- [`prosemirror-autocomplete`](https://github.com/curvenote/editor/tree/main/packages/prosemirror-autocomplete) - A plugin for [ProseMirror](https://prosemirror.net/) that adds triggers for `#hashtags`, `@mentions`, `/menus`, and other more complex autocompletions.
- [`prosemirror-codemark`](https://github.com/curvenote/editor/tree/main/packages/prosemirror-codemark) - A plugin for [ProseMirror](https://prosemirror.net/) that handles manipulating and navigating inline code marks.

### Related packages

- [`prosemirror-docx`](https://github.com/curvenote/prosemirror-docx) - Export from a [ProseMirror](https://prosemirror.net/) schema to Microsoft Word.
- [`sidenotes`](https://github.com/curvenote/sidenotes) - Reactive placement of comments, with hooks for multiple inline references.
- [`@curvenote/article`](https://github.com/curvenote/article) - CSS and styling components and document layout
- [`@curvenote/components`](https://github.com/curvenote/components) - interactive widgets and web-components
- [`@curvenote/runtime`](https://github.com/curvenote/runtime) - client-side reactivity built on redux

A collaborative, rich text editor for interactive technical & scientific content., implementing the MyST Markdown, and integrating with JupyterLab, JupyterBook and Sphinx. The project will enable a larger audience to create publication-quality, standards-friendly documents through Jupyter, without having to learn a new syntax.

## Roadmap

We use this editor at [Curvenote](https://curvenote.com) where we have worked on it for the last few years. We will continue to spin out useful plugins like [`prosemirror-autocomplete`](https://github.com/curvenote/prosemirror-autocomplete) and [`prosemirror-codemark`](https://github.com/curvenote/prosemirror-codemark). If you would like to see something specific, open an [issue](https://github.com/curvenote/editor/issues/new) or [email](mailto:support@curvenote.com), or try out the editor on [Curvenote](https://curvenote.com)!

## 2022

- Improve Markdown, Word and LaTeX export
- Improve collaboration experience (cursors and highlights)
  - Possibly move to yjs as the collaboration backend
- Improve configuration/extensibility
- Improve/documentation integration demos
- Improve math editor, adding a WYSIWYG math editor (likely as plugin)

## Other ideas and plans

- Integrate as a JupyterLab extension (would love help!!)
- Integrate with ipywidgets (would love help!!)
- Integrate with thebe (would love help!!)

## Getting Started

```
git clone git@github.com:curvenote/editor.git
cd editor
npm install
npm run start
```
