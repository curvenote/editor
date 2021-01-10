import { Schema, DOMParser as DOMParserPM } from 'prosemirror-model';
import { setInnerHTML } from './utils';
import { Parser } from '../../types';


function migrateV0(element: HTMLDivElement, document: Document, DOMParser: Parser): HTMLDivElement {
  // Bring all variables to the top of the document:
  const vars = Array.from(element.querySelectorAll('ink-var'));
  vars.reverse().forEach((n) => {
    n.parentElement?.removeChild(n);
    element.prepend(n);
  });
  const displays = Array.from(element.querySelectorAll('ink-display'));
  displays.forEach((n) => {
    const transform = n.getAttribute('transform');
    const name = n.getAttribute('name') ?? '';
    n.setAttribute(':value', transform || name);
    n.removeAttribute('transform');
    n.removeAttribute('name');
  });
  const dynamics = Array.from(element.querySelectorAll('ink-dynamic'));
  dynamics.forEach((n) => {
    const name = n.getAttribute('name') ?? '';
    n.setAttribute(':value', name);
    n.setAttribute(':change', `{${n.getAttribute('name')}: value}`);
    n.removeAttribute('name');
  });
  const ranges = Array.from(element.querySelectorAll('ink-range'));
  ranges.forEach((n) => {
    const name = n.getAttribute('name') ?? '';
    n.setAttribute(':value', name);
    n.setAttribute(':change', `{${n.getAttribute('name')}: value}`);
    n.removeAttribute('name');
  });
  const asides = Array.from(element.querySelectorAll('ink-aside'));
  asides.forEach((n) => {
    const aside = setInnerHTML(document.createElement('aside'), n.innerHTML, DOMParser);
    n.replaceWith(aside);
  });
  const callouts = Array.from(element.querySelectorAll('ink-callout'));
  callouts.forEach((n) => {
    const kind = n.getAttribute('kind') || 'info';
    const callout = setInnerHTML(document.createElement('aside'), n.innerHTML, DOMParser);
    callout.classList.add('callout');
    callout.classList.add(kind);
    n.replaceWith(callout);
  });
  const html = element.innerHTML;
  return setInnerHTML(document.createElement('div'), html.replace(/<ink-/g, '<r-').replace(/<\/ink-/g, '</r-'), DOMParser) as HTMLDivElement;
}

function migrateV1(element: HTMLDivElement): HTMLDivElement {
  const equations = Array.from(element.querySelectorAll('p > r-equation'));
  equations.forEach((n) => {
    n.setAttribute('inline', '');
  });
  return element;
}

export function migrateHTML(content: string, document: Document, DOMParser: Parser) {
  const element = setInnerHTML(document.createElement('div'), content, DOMParser) as HTMLDivElement;
  return migrateV1(migrateV0(element, document, DOMParser));
}

export function fromHTML(
  content: string, schema: Schema, document: Document, DOMParser: Parser,
) {
  const element = migrateHTML(content, document, DOMParser);
  const doc = DOMParserPM.fromSchema(schema).parse(element);
  return doc;
}
