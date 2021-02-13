# sidenotes
[![sidenotes on npm](https://img.shields.io/npm/v/sidenotes.svg)](https://www.npmjs.com/package/sidenotes)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/curvenote/sidenotes/main/LICENSE)
![CI](https://github.com/curvenote/sidenotes/workflows/CI/badge.svg)

**Position floating sidenotes/comments next to a document with inline references.**

## Goals
* Place notes/comments to the side of one or more documents with inline references.
* When an inline reference is clicked, animate the relevant sidenote to be as close as possible and move non-relevant sidenotes out of the way without overlapping.
* Do not provide UI or impose any styling, **only placement**.

## Use cases

* Comment streams next to a document. This is showing [Curvenote](https://curvenote.com), which is a scientific writing platform that connects to Jupyter.
[![Comments Using Sidenotes](https://github.com/curvenote/sidenotes/raw/main/images/comments.gif)](https://curvenote.com)

## Chocies
* Use React, Redux & Typescript
* Used Redux rather than a hook approach (open to discussion if people are passionate!)

## Constraints
* Multiple documents on the page, currently based on the wrapping `<article>` ID
* Multiple inline references per sidenote, wrapped in `<InlineAnchor>`; `InlineAnchor` is a `span`
* Have fallback placements to a `<AnchorBase>`; `AnchorBase` is a `div`
* Provide actions to attach non-react bases, anchors or reposition sidenotes
* All positioning is based on the article, and works with `relative`, `fixed` or `absolute` positioning.

## Demo
The demo is pretty basic, and not nearly as pretty as the gif above, just blue, green and red divs floating around.
See [index.tsx](/demo/index.tsx) for full the code/setup.
```
yarn install
yarn start
```

![sidenotes](https://github.com/curvenote/sidenotes/raw/main/images/sidenotes.gif)

## Getting Started:
```
yarn add sidenotes
```

## React Setup:

```html
<article id={docId} onClick={deselect}>
  <AnchorBase anchor={baseId}>
    Content with <InlineAnchor sidenote={sidenoteId}>inline reference</InlineAnchor>
  </AnchorBase>
  <div className="sidenotes">
    <Sidenote sidenote={sidenoteId} base={baseId}>
      Your custom UI, e.g. a comment
    </Sidenote>
  </div>
</article>
```

The `sidenotes` class is the only CSS that is recommended. You can import it directly, or [look at it](/styles/index.scss) and change it (~30 lines of `scss`). To import from javascript (assuming your bundler works with CSS):

```javascript
import 'sidenotes/dist/sidenotes.css';
```

## Redux state

Once you create your own store, add a `sidenotes.reducer`, it must be called `sidenotes`. Then pass the `store` to `setup` with options of padding between sidenotes.

```javascript
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as sidenotes from 'sidenotes';

const reducer = combineReducers({
  yourStuff: yourReducers,
  sidenotes: sidenotes.reducer, // Add this to your reducers
});
// Create your store as normal, must have thunkMiddleware
const store = createStore(reducer, applyMiddleware(thunkMiddleware));

// Then ensure that you pass the `store` to setup the sidenotes
sidenotes.setup(store as sidenotes.Store, { padding: 10 })
```

## Redux State
The `sidenotes.ui` state has the following structure:

```
sidenotes:
  ui:
    docs:
      [docId]:
        anchors:
          [anchorId]: { id: string, sidenote: string, element: [span] }
        sidenotes:
          [sidenoteId]: { inlineAnchors: string[], top: number, id: string, baseAnchors: string[] }
        id: string
        selectedAnchor: string
        selectedNote: string
```


## Roadmap
* Have a better mobile solution that places notes at the bottom.
