import { Parser } from '../types';

export function setInnerHTML(element: Element, content: string, DOMParser: Parser) {
  // NOTE: doing a naive .innerHTML does not copy over some attributes e.g. ":value"
  // Although it does in JSDOM ... :(
  const dom = new DOMParser().parseFromString(content, 'text/html').body;
  element.append(...Array.from(dom.children));
  return element;
}
