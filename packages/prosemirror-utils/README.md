# Utils library for ProseMirror

[![@curvenote/prosemirror-utils on npm](https://img.shields.io/npm/v/@curvenote/prosemirror-utils.svg)](https://www.npmjs.com/package/@curvenote/prosemirror-utils)
[![License](https://img.shields.io/npm/l/@curvenote/prosemirror-utils.svg?style=flat-square)](http://www.apache.org/licenses/LICENSE-2.0)
![CI](https://github.com/curvenote/editor/workflows/CI/badge.svg)

This is a port of [prosemirror-utils](https://github.com/atlassian/prosemirror-utils) to typescript and updating dependencies and build.

## Quick Start

Install `@curvenote/prosemirror-utils` package from npm:

```sh
npm install @curvenote/prosemirror-utils
```

## Public API documentation

### Utils for working with `selection`

@findParentNode

@findParentNodeClosestToPos

@findParentDomRef

@hasParentNode

@findParentNodeOfType

@findParentNodeOfTypeClosestToPos

@hasParentNodeOfType

@findParentDomRefOfType

@findSelectedNodeOfType

@isNodeSelection

@findPositionOfNodeBefore

@findDomRefAtPos

### Utils for working with ProseMirror `node`

@flatten

@findChildren

@findTextNodes

@findInlineNodes

@findBlockNodes

@findChildrenByAttr

@findChildrenByType

@findChildrenByMark

@contains

### Utils for document transformation

@removeParentNodeOfType

@replaceParentNodeOfType

@removeSelectedNode

@replaceSelectedNode

@canInsert

@safeInsert

@setParentNodeMarkup

@selectParentNodeOfType

@removeNodeBefore

@setTextSelection

## License

- **Apache 2.0** : http://www.apache.org/licenses/LICENSE-2.0
