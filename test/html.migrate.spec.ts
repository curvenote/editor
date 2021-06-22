import { JSDOM } from 'jsdom';
import { setInnerHTML } from '../src/parse/html/utils';
import { migrateHTML } from '../src';

const { document, DOMParser } = new JSDOM('').window;

const nestedVariable =
  '<p>Hello<ink-var name="x" value="3" format=".1f"></ink-var><ink-var name="y" value="3" format=".1f"></ink-var></p>';
const displays =
  '<p>Hello <ink-display name="x" format=".1f" transform=""></ink-display> <ink-display name="y" format=".1f" transform="y + 1"></ink-display></p>';
const dynamics = '<p>Hello <ink-dynamic name="days"></ink-dynamic></p>';
const ranges = '<p>Hello <ink-range name="days"></ink-range></p>';
const asides = '<p>Hello</p><ink-aside>Aside</ink-aside>';
const callouts =
  '<p>Hello</p><ink-callout kind="info">Callout</ink-callout><ink-callout kind="danger">Callout</ink-callout>';

function getElement(content: string) {
  const element = setInnerHTML(document.createElement('div'), content, DOMParser);
  return element;
}

describe('Upgrades', () => {
  it('should bring nested variables to the top', () => {
    const content = nestedVariable;
    const before = getElement(content);
    const after = migrateHTML(content, document, DOMParser);
    expect(before.children.length).toBe(1);
    expect(before.children[0].nodeName).toBe('P');
    expect(before.children[0].children[0].nodeName).toBe('INK-VAR');
    expect(before.children[0].children[1].nodeName).toBe('INK-VAR');
    expect(after.children.length).toBe(3);
    expect(after.children[0].nodeName).toBe('R-VAR');
    expect(after.children[0].getAttribute('name')).toBe('x');
    expect(after.children[1].nodeName).toBe('R-VAR');
    expect(after.children[1].getAttribute('name')).toBe('y');
  });
  it('Change the displays to the correct format', () => {
    const content = displays;
    const before = getElement(content);
    const after = migrateHTML(content, document, DOMParser);
    expect(before.children.length).toBe(1);
    expect(before.children[0].nodeName).toBe('P');
    expect(before.children[0].children[0].nodeName).toBe('INK-DISPLAY');
    expect(before.children[0].children[0].getAttribute('name')).toBe('x');
    expect(before.children[0].children[0].getAttribute('transform')).toBe('');
    expect(before.children[0].children[1].nodeName).toBe('INK-DISPLAY');
    expect(before.children[0].children[1].getAttribute('name')).toBe('y');
    expect(before.children[0].children[1].getAttribute('transform')).toBe('y + 1');
    expect(after.children.length).toBe(1);
    expect(after.children[0].children[0].nodeName).toBe('R-DISPLAY');
    expect(after.children[0].children[0].getAttribute('name')).toBeNull();
    expect(after.children[0].children[0].getAttribute('transform')).toBeNull();
    expect(after.children[0].children[0].getAttribute(':value')).toBe('x');
    expect(after.children[0].children[1].nodeName).toBe('R-DISPLAY');
    expect(after.children[0].children[1].getAttribute('name')).toBeNull();
    expect(after.children[0].children[1].getAttribute('transform')).toBeNull();
    expect(after.children[0].children[1].getAttribute(':value')).toBe('y + 1');
  });
  it('Change the dynamics to the correct format', () => {
    const content = dynamics;
    const before = getElement(content);
    const after = migrateHTML(content, document, DOMParser);
    expect(before.children.length).toBe(1);
    expect(before.children[0].nodeName).toBe('P');
    expect(before.children[0].children[0].nodeName).toBe('INK-DYNAMIC');
    expect(before.children[0].children[0].getAttribute('name')).toBe('days');
    expect(after.children.length).toBe(1);
    expect(after.children[0].children[0].nodeName).toBe('R-DYNAMIC');
    expect(after.children[0].children[0].getAttribute('name')).toBeNull();
    expect(after.children[0].children[0].getAttribute(':value')).toBe('days');
    expect(after.children[0].children[0].getAttribute(':change')).toBe('{days: value}');
  });
  it('Change the ranges to the correct format', () => {
    const content = ranges;
    const before = getElement(content);
    const after = migrateHTML(content, document, DOMParser);
    expect(before.children.length).toBe(1);
    expect(before.children[0].nodeName).toBe('P');
    expect(before.children[0].children[0].nodeName).toBe('INK-RANGE');
    expect(before.children[0].children[0].getAttribute('name')).toBe('days');
    expect(after.children.length).toBe(1);
    expect(after.children[0].children[0].nodeName).toBe('R-RANGE');
    expect(after.children[0].children[0].getAttribute('name')).toBeNull();
    expect(after.children[0].children[0].getAttribute(':value')).toBe('days');
    expect(after.children[0].children[0].getAttribute(':change')).toBe('{days: value}');
  });
  it('Change the aside', () => {
    const content = asides;
    const before = getElement(content);
    const after = migrateHTML(content, document, DOMParser);
    expect(before.children.length).toBe(2);
    expect(before.children[0].nodeName).toBe('P');
    expect(before.children[1].nodeName).toBe('INK-ASIDE');
    expect(after.children.length).toBe(2);
    expect(after.children[0].nodeName).toBe('P');
    expect(after.children[1].nodeName).toBe('ASIDE');
  });
  it('Change the callouts', () => {
    const content = callouts;
    const before = getElement(content);
    const after = migrateHTML(content, document, DOMParser);
    expect(before.children.length).toBe(3);
    expect(before.children[0].nodeName).toBe('P');
    expect(before.children[1].nodeName).toBe('INK-CALLOUT');
    expect(before.children[1].getAttribute('kind')).toBe('info');
    expect(before.children[2].nodeName).toBe('INK-CALLOUT');
    expect(before.children[2].getAttribute('kind')).toBe('danger');
    expect(after.children.length).toBe(3);
    expect(after.children[0].nodeName).toBe('P');
    expect(after.children[1].nodeName).toBe('ASIDE');
    expect(after.children[1].classList.contains('callout')).toBe(true);
    expect(after.children[1].classList.contains('info')).toBe(true);
    expect(after.children[1].classList.contains('danger')).toBe(false);
    expect(after.children[2].nodeName).toBe('ASIDE');
    expect(after.children[2].classList.contains('callout')).toBe(true);
    expect(after.children[2].classList.contains('info')).toBe(false);
    expect(after.children[2].classList.contains('danger')).toBe(true);
  });
});
