import { JSDOM } from 'jsdom';
import { getEditorState } from '.';

const { document, DOMParser } = new JSDOM('').window;


const v0 = '<p>We have some variables!</p><p><ink-var name="x" value="3" format=".1f"></ink-var></p><p><ink-range name="x"></ink-range><ink-equation>x =</ink-equation> <ink-display name="x" format=".1f" transform=""></ink-display></p><p>Note that you can talk about the variable and show it: <ink-display name="x" format=".3f" transform=""></ink-display> (e.g. with way more accuracy!).</p><p>And the <code>range</code> again: <ink-range name="x"></ink-range></p><p>We can also create derived values for our variables. For example: <ink-var name="x2" value="" :value="x ** 2" format=".0f"></ink-var>.</p><p>This is a user defined function that evaluates <ink-equation>x^2</ink-equation>. In this case, the square of <ink-display name="x" format=".0f" transform=""></ink-display> is <strong><ink-display name="x2" format="" transform=""></ink-display></strong>.</p>';
const v1 = '<r-var name="v" value="1" format=".0f"></r-var><h1 id="create-some-variables">Create some variables</h1><p><r-range value="10" :value="v" :change="{v: value}" min="0" max="100" step="1"></r-range></p><p><r-display value="" :value="v" format=""></r-display> and <r-display value="" :value="v + 1" format=""></r-display></p><aside><p>This is over here!</p></aside><aside class="callout info"><p>This is a callout!</p></aside><p>This is half: <r-equation>\\frac{1}{2}</r-equation> which is nice!</p>';

describe('Upgrades', () => {
  it('should update v0', () => {
    const state = getEditorState(v0, 0, document, DOMParser);
    const doc = state.doc.toJSON();
    expect(doc.content[0].type).toBe('var');
    expect(doc.content[1].type).toBe('var');
    expect(doc.content[4].content[0].attrs.changeFunction).toBe('{x: value}');
  });
  it('should not change v1', () => {
    const state = getEditorState(v1, 0, document, DOMParser);
    const doc = state.doc.toJSON();
    expect(doc.content[0].type).toBe('var');
  });
});
