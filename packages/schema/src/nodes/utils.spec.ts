import { flattenValues } from './utils';

describe('flattenValues', () => {
  it('node with no value/children returns empty string', () => {
    expect(flattenValues({ type: 'empty' })).toEqual('');
  });
  it('node with value returns value', () => {
    expect(flattenValues({ type: 'text', value: 'example' })).toEqual('example');
  });
  it('node with value and children returns value', () => {
    expect(
      flattenValues({
        type: 'doubleNode',
        value: 'example',
        children: [{ type: 'text', value: 'ignored' }],
      }),
    ).toEqual('example');
  });
  it('node with child returns child value', () => {
    expect(
      flattenValues({
        type: 'paragraph',
        children: [{ type: 'text', value: 'example' }],
      }),
    ).toEqual('example');
  });
  it('node with multiple children returns combined value', () => {
    expect(
      flattenValues({
        type: 'paragraph',
        children: [
          { type: 'text', value: 'one ' },
          { type: 'text', value: 'two ' },
          { type: 'text', value: 'three' },
        ],
      }),
    ).toEqual('one two three');
  });
  it('node with nested children returns recursively combined value', () => {
    expect(
      flattenValues({
        type: 'paragraph',
        children: [
          { type: 'text', value: 'zero ' },
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'one ' },
              { type: 'text', value: 'two ' },
            ],
          },
          { type: 'text', value: 'three' },
        ],
      }),
    ).toEqual('zero one two three');
  });
});
