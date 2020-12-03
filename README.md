# @iooxa/editor
[![@iooxa/editor on npm](https://img.shields.io/npm/v/@iooxa/editor.svg)](https://www.npmjs.com/package/@iooxa/editor)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/iooxa/editor/blob/master/LICENSE)
![CI](https://github.com/iooxa/schema/workflows/CI/badge.svg)

**Overview & Goals**
* Provide a typed schema for writing reactive scientific documents using [iooxa components](https://iooxa.dev)
  * Uses [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) in the rendered HTML output for non-standard components
  * Uses standard html for all other compnents, with no styling enforced
* Interoperability with CommonMark markdown and [myst](https://github.com/executablebooks/markdown-it-myst)
  * Through `fromMarkdown` and `toMarkdown` methods
* Provide components for [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) editing of reactive documents
  * Initial library won't have a drop-in UI for the editor, although there will probably be a simple demo

**Choices**
* The internal representation for the library is a [ProseMirror Document](https://prosemirror.net/docs/guide/#doc) structure (that can be rendered as JSON)
* [markdown-it](https://github.com/markdown-it/markdown-it) is used parse and tokenize markdown content

## Schema

The schema has `Nodes` and `Marks` where `Nodes` are basically a block of content (paragraph, code, etc.), and `Marks` are inline modifications to the content (bold, emphasis, links, etc.). See the ProseMirror docs for a [visual explanation](https://prosemirror.net/docs/guide/#doc).

**Overview of `Nodes`**

* Basic Markdown
  * text
  * paragraph
  * heading
  * blockquote
  * code_block
  * image
  * horizontal_rule
  * hard_break
  * ordered_list
  * bullet_list
  * list_item
* Presentational Components
  * [callout](https://iooxa.dev/article/callout)
  * [aside](https://iooxa.dev/article/aside)
  * [math](https://iooxa.dev/article/math)
  * [equation](https://iooxa.dev/article/equation)
* Reactive Components
  * [variable](https://iooxa.dev/components/variable)
  * [display](https://iooxa.dev/components/display)
  * [dynamic](https://iooxa.dev/components/dynamic)
  * [range](https://iooxa.dev/components/range)
  * [switch](https://iooxa.dev/components/switch)

**Overview of `Marks`**

* link
* code
* em
* strong
* superscript
* subscript
* strikethrough
* underline
* abbr


## Simple Example

This moves from markdown --> JSON --> HTML. The JSON is the intermediate representation for `@iooxa/editor`.

```javascript
import { Schema, nodes, marks, fromMarkdown, toHTML } from '@iooxa/editor';
import { JSDOM } from 'jsdom';

const schema = new Schema({ nodes, marks });

const content = '# Hello `@iooxa/editor`!';
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
            "text": "@iooxa/editor"
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
>> "<h1>Hello <code>@iooxa/editor</code>!</h1>"
```

### Roadmap

* Integrate other `@iooxa/components` as nodes
* Improve equation and start to go to/from various myst syntax for this
* Add figure properties (name, width, caption etc.)
* Provide citations, probably bring in a bibtex parser
  * Introduce citation and reference component to iooxa/components or article
* Add overlaping roles/directives with myst (e.g. see [executablebooks/meta#70](https://github.com/executablebooks/meta/issues/70)) for pointers
  * Add the necessary pieces to iooxa/components that are not basic html (myst uses sphinx for the heavy lifting, cross-refs etc.)
* Provide other sereializers from the document strucutre (e.g. latex or simple html without iooxa/components, possibly idyll)


## See also:
* [Idyll Lang](https://idyll-lang.org/) has a different markdown-like serialization with very similar base components to iooxa - see [iooxa/article#8](https://github.com/iooxa/article/issues/8) for a comparison.
