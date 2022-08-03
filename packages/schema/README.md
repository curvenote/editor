# @curvenote/schema

[![@curvenote/schema on npm](https://img.shields.io/npm/v/@curvenote/schema.svg)](https://www.npmjs.com/package/@curvenote/schema)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/curvenote/editor/blob/main/LICENSE)
![CI](https://github.com/curvenote/editor/workflows/CI/badge.svg)

Schema for interactive scientific writing, with translations to [MyST flavoured markdown](https://myst-parser.readthedocs.io/en/latest/), LaTeX, and HTML.

![@curvenote/schema in curvenote.com](https://github.com/curvenote/editor/raw/main/packages/schema/images/schema.gif)

## Overview & Goals

- Provide a typed schema for writing reactive scientific documents using [@curvenote/components](https://curvenote.dev)
  - Uses [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) in the rendered HTML output for non-standard components
  - Uses standard html for all other compnents, with no styling enforced
- Interoperability with CommonMark markdown and [MyST](https://github.com/executablebooks/markdown-it-myst)
  - Through `fromMarkdown` and `toMarkdown` methods
- Provide components for [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) editing of reactive documents
  - See [`@curvenote/editor`](https://github.com/curvenote/editor) or [curvenote.com](Curvenote.com) for the editor!

## Choices

- The internal representation for the library is a [ProseMirror Document](https://prosemirror.net/docs/guide/#doc) structure (that can be rendered as JSON)
- [markdown-it](https://github.com/markdown-it/markdown-it) is used parse and tokenize markdown content

## Schema

The schema has `Nodes` and `Marks` where `Nodes` are basically a block of content (paragraph, code, etc.), and `Marks` are inline modifications to the content (bold, emphasis, links, etc.). See the ProseMirror docs for a [visual explanation](https://prosemirror.net/docs/guide/#doc).

**Overview of `Nodes`**

- Basic Markdown
  - text
  - paragraph
  - heading
  - blockquote
  - code_block
  - image
  - horizontal_rule
  - hard_break
  - ordered_list
  - bullet_list
  - list_item
- Presentational Components
  - [callout](https://curvenote.dev/article/callout)
  - [aside](https://curvenote.dev/article/aside)
  - [math](https://curvenote.dev/article/math)
  - [equation](https://curvenote.dev/article/equation)
- Reactive Components
  - [variable](https://curvenote.dev/components/variable)
  - [display](https://curvenote.dev/components/display)
  - [dynamic](https://curvenote.dev/components/dynamic)
  - [range](https://curvenote.dev/components/range)
  - [switch](https://curvenote.dev/components/switch)

**Overview of `Marks`**

- link
- code
- em
- strong
- superscript
- subscript
- strikethrough
- underline
- abbr

## Simple Example

This moves from markdown --> JSON --> HTML. The JSON is the intermediate representation for `@curvenote/editor`.

```javascript
import { Schema, nodes, marks, fromMarkdown, toHTML } from '@curvenote/schema';
import { JSDOM } from 'jsdom';

const schema = new Schema({ nodes, marks });

const content = '# Hello `@curvenote/schema`!';
const doc = fromMarkdown(content, schema);

console.log(doc.toJSON());
>> {
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [
          { "type": "text", "text": "Hello " },
          {
            "type": "text",
            "marks": [ { "type": "code" } ],
            "text": "@curvenote/schema"
          },
          { "type": "text", "text": "!" }
        ]
      }
    ]
  }

// Assuming we are in node, just use `document` if in a browser!
const { document } = new JSDOM('').window;

// Now move the document back out to html
const html = toHTML(doc, schema, document);

console.log(html);
>> "<h1>Hello <code>@curvenote/schema</code>!</h1>"
```

### Roadmap

- Integrate other `@curvenote/components` as nodes
- Improve equation and start to go to/from various MyST syntax for this
- Add figure properties (name, width, caption etc.)
- Provide citations, probably bring in a bibtex parser
  - Introduce citation and reference component to curvenote/components or article
- Add overlaping roles/directives with MyST (e.g. see [executablebooks/meta#70](https://github.com/executablebooks/meta/issues/70)) for pointers
  - Add the necessary pieces to curvenote/components that are not basic html (MyST uses sphinx for the heavy lifting, cross-refs etc.)
- Provide other sereializers from the document strucutre (e.g. latex or simple html without curvenote/components, possibly idyll)

## See also:

- [Idyll Lang](https://idyll-lang.org/) has a different markdown-like serialization with very similar base components to curvenote - see [curvenote/article#8](https://github.com/curvenote/article/issues/8) for a comparison.
