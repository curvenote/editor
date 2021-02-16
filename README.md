# @curvenote/editor
[![@curvenote/editor on npm](https://img.shields.io/npm/v/@curvenote/editor.svg)](https://www.npmjs.com/package/@curvenote/editor)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/curvenote/editor/blob/main/LICENSE)
![CI](https://github.com/curvenote/editor/workflows/CI/badge.svg)
[![demo](https://img.shields.io/badge/live-demo-blue)](https://curvenote.github.io/editor/)

An interactive scientific editor built with [ProseMirror](https://prosemirror.net/), [React](http://reactjs.org/) and [Redux](https://redux.js.org/) - by [Curvenote](https://curevnote.com).

![@curvenote/editor in curvenote.com](https://github.com/curvenote/editor/raw/main/images/editor.gif)

## Why
We think that creating beautiful reactive documents and explorable explanations should be easy. Writing technical documents is hard enough already, and choosing to make that writing interactive is beyond the reach or time-commitment of most communicators.

We aim to lower the barriers to *writing* computational narratives. Today, *narrative* is often moved out of computational notebooks into *static* document creation tools (Microsoft Word, Google Docs, LaTeX, Slides/PPT).

We think this is for two reasons:

1. The need for more expressive components, formatting or referencing.
    * [CommonMark](https://commonmark.org/) markdown does not support, for example, citations, cross-references, and even simple formatting like callouts (see various alternatives below).
2. To enable collaborators and reviewers who don't use these tools (e.g. when writing and reviewing papers & reports, slide decks, etc.)
    * Writing often requires collaborators that may not be comfortable with some combination of the tools required for computational narratives (e.g. git, md, notebooks, javascript, etc.).

## Goals
`@curvenote/editor` aims to bridge the gap between expressiveness and writing accessibility by developing a rich, [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG), collaborative editor with a focus on interactivity that integrates with LaTeX, various flavours of Markdown, and the Jupyter and Sphinx ecosystems.

## Overlap with [Curvenote](https://curvenote.com)
`@curvenote/editor` is the editor that is used in [Curvenote](https://curvenote.com), which is a scientific writing platform that connects to Jupyter.

## Alternatives
There are *many* Markdown syntax variants and extensions (e.g. [RMarkdown](https://rmarkdown.rstudio.com/), [MyST](https://myst-parser.readthedocs.io/en/latest/), [idyll-lang](https://idyll-lang.org/), [MDX](https://mdxjs.com/)) that add flavours (usually) on top of [CommonMark](https://commonmark.org/) to allow for more complex documents and various degrees of interactivity. These syntaxes or development environments are often beyond the reach of many contributors and collaborative editing and review is often not a priority.

### Interactivity
We think the best explanations are [explorable](http://explorabl.es/) and promote [*active* reading](http://worrydream.com/ExplorableExplanations/), and would love to see this style of writing more widely adopted in scientific teaching, writing and education. To us, that means deep integrations with the Jupyter ecosystem and providing ways to support traditional export as well.

## Scope of Repository
A [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) editor for technical content and documents (papers, reports, documentation, etc.), and support computational into the narrative (c.f. [explorable explanations](http://worrydream.com/ExplorableExplanations/)).

**Specifically:**
* A stand alone scientific editor that can be integrated into other applications, [React](http://reactjs.org/) will be supported first-class.
* Integration points for collaboration, citations, and interactivity/reactivity.
* Over time, and where appropriate, smaller tools will be broken off to standalone projects (e.g. see below for the first ones).
  * Likely some of the prosemirror plugins [see here](/src/prosemirror/plugins/README.md), comments, etc.

### Related Projects

* [`@curvenote/schema`](https://github.com/curvenote/schema) - the schema for this editor, focused on interactive content, also deals with translation and export.
* [`sidenotes`](https://github.com/curvenote/sidenotes) - Reactive placement of comments, with hooks for multiple inline references.
* [`@curvenote/article`](https://github.com/curvenote/article) - CSS and styling components and document layout
* [`@curvenote/components`](https://github.com/curvenote/components) - interactive widgets and web-components
* [`@curvenote/runtime`](https://github.com/curvenote/runtime) - client-side reactivity built on redux

A collaborative, rich text editor for interactive technical & scientific content., implementing the MyST standard, and integrating with JupyterLab, JupyterBook and Sphinx. The project will enable a larger audience to create publication-quality, standards-friendly documents through Jupyter, without having to learn a new syntax.

## Architecture
* Basic prosemirror, wrapped in a React component with some middleware in Redux.
* Chosen to have many "blocks" of the editor on a page at once. See the UI in [Curvenote](https://curevnote.com) as to what we are supporting - inspired in part by [Jupyter](https://jupyter.org/).
  * If you only need one editor on the page, the weird part will be integrating with Redux, and some unnecessary indexing. However, this is probably important anyways if you have comments or other places in the DOM that are instances of the editor.
* Typescript and fully typed.
* Styling of editor components with [material-ui](https://material-ui.com)
* Reactivity powered by `@curvenote/components` and `@curvenote/runtime`, which are [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).
* Real-time collaboration is possible through middleware integrations. See [prosemirror-collab](https://github.com/ProseMirror/prosemirror-collab).
  * We will (eventually) improve support for cursors and highlights. See Roadmap.
* See [demo/index.tsx](/demo/index.tsx) for an example setup.


## Roadmap

We have recently (Feb 2021) spun this out of internal development at [Curvenote](https://curvenote.com) where we have worked on it for the last year. Docs and testing aren't yet up to our open source standards 😬. We will improve these over time! In the mean time, star the repo, watch it, or send us an [issue](https://github.com/curvenote/editor/issues/new) or [email](mailto:support@curvenote.com), or try out the editor on [Curvenote](https://curvenote.com)!

## Q1-Q2, 2021
* Improve math editor (look at [prosemirror-math](https://github.com/benrbray/prosemirror-math)).
* Improve MyST and LaTeX export
* Improve collaboration experience (cursors and highlights)
  * Possibly move to yjs as the collaboration backend
* Improve/documentation integration demos

## Other ideas and plans
* Integrate as a JupyterLab extension (would love help!!)
* Integrate with ipywidgets (would love help!!)
* Integrate with thebelab (would love help!!)


## Getting Started

```
git clone git@github.com:curvenote/editor.git
cd editor
yarn install
yarn build
yarn start
```

See the [demo folder](/demo/index.tsx) from more details on how to get started.
