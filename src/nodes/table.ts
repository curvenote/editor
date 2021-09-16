import { tableNodes } from 'prosemirror-tables';
import { FormatSerialize, NodeGroups } from './types';

export const nodes = tableNodes({
  tableGroup: NodeGroups.top,
  cellContent: NodeGroups.blockOrEquation,
  cellAttributes: {
    background: {
      default: null,
      getFromDOM(dom: any) {
        return dom.style.backgroundColor || null;
      },
      setDOMAttr(value: any, attrs: any) {
        // eslint-disable-next-line no-param-reassign, prefer-template
        if (value) attrs.style = (attrs.style || '') + `background-color: ${value};`;
      },
    },
  },
});

export const toMarkdown: FormatSerialize = (state, node) => {
  console.log('table markdown', node.attrs);
  state.write('');
};
export const toTex: FormatSerialize = (state, node) => {};
