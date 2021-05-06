import { NodeSpec } from 'prosemirror-model';
import { format } from 'date-fns';
import { NodeGroups, FormatSerialize } from './types';

export function getDatetime(object?: Date | string | null): Date {
  if (object == null) {
    return new Date();
  }
  if (object instanceof Date) {
    return object;
  }
  if (typeof object === 'string') {
    return new Date(object);
  }
  // eslint-disable-next-line no-console
  console.error(`Could not parse date: ${object}`);
  return new Date();
}

export const formatDatetime = (datetime: string | Date | null): { d: Date, f: string } => {
  try {
    const d = getDatetime(datetime);
    const f = format(d, 'LLL d, yyyy');
    return { d, f };
  } catch (e) {
    return formatDatetime(new Date());
  }
};

const time: NodeSpec = {
  group: NodeGroups.inline,
  inline: true,
  marks: '',
  draggable: true,
  attrs: {
    datetime: { default: null },
  },
  toDOM(node) {
    const { d, f } = formatDatetime(node.attrs.datetime);
    return ['time', { datetime: d.toISOString() }, f];
  },
  parseDOM: [
    {
      tag: 'time',
      getAttrs(dom: any) {
        return {
          datetime: getDatetime(dom.getAttribute('datetime')),
        };
      },
    },
  ],
};

export const toMarkdown: FormatSerialize = (state, node) => {
  const { f } = formatDatetime(node.attrs.datetime);
  state.write(f);
};


export const toTex: FormatSerialize = (state, node) => {
  const { f } = formatDatetime(node.attrs.datetime);
  state.write(f);
};

export default time;
