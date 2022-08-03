/* eslint-disable max-classes-per-file */

import { createId } from '../../utils';

export class Text {
  kind = 'text';

  id: string;

  text: string;

  constructor(text: string) {
    this.id = createId();
    this.text = text;
  }
}

export class Node {
  kind = 'node';

  id: string;

  tag: string;

  name: string;

  children: (Node | Text)[];

  attrs: Record<string, any>;

  constructor(tag: string, name = 'unknown') {
    this.id = createId();
    this.tag = tag;
    this.name = name;
    this.children = [];
    this.attrs = {};
  }

  appendChild(child: Node | Text) {
    this.children.push(child);
  }

  setAttribute(name: string, value: any) {
    this.attrs[name] = value;
  }

  setAttributeNS(_: string, name: string, value: any) {
    this.attrs[name] = value;
  }
}

export class Fragment {
  children: (Node | Text)[];

  constructor() {
    this.children = [];
  }

  appendChild(child: Node | Text) {
    this.children.push(child);
  }
}

export function createDocument() {
  const document = {
    createTextNode(text: string) {
      return new Text(text);
    },
    createElementNS(name: string, tag: string) {
      return new Node(tag, name);
    },
    createElement(tag: string) {
      return new Node(tag);
    },
    createDocumentFragment() {
      return new Fragment();
    },
  };
  return document;
}
