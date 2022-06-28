# Utils library for ProseMirror

[![prosemirror-utils1 on npm](https://img.shields.io/npm/v/prosemirror-utils1.svg)](https://www.npmjs.com/package/prosemirror-utils1)
[![License](https://img.shields.io/npm/l/prosemirror-utils1.svg?style=flat-square)](http://www.apache.org/licenses/LICENSE-2.0)
![CI](https://github.com/curvenote/prosemirror-utils/workflows/CI/badge.svg)

Note: this is a port of prosemirror-utils to typescript and updating dependencies and build.

## Quick Start

Install `prosemirror-utils1` package from npm:

```sh
npm install prosemirror-utils1
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
