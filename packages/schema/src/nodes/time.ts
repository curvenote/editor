import { format } from 'date-fns';
import type { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import type { Time } from '../spec';
import type { MyNodeSpec } from './types';
import { NodeGroups } from './types';

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

export function formatDatetime(datetime: string | Date | null): { d: Date; f: string } {
  try {
    const d = getDatetime(datetime);
    const f = format(d, 'LLL d, yyyy');
    return { d, f };
  } catch (e) {
    return formatDatetime(new Date());
  }
}

export type Attrs = {
  datetime: Date | null;
};

const time: MyNodeSpec<Attrs, Time> = {
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
  attrsFromMyst: (token) => ({ datetime: getDatetime(token.time) }),
  toMyst: (props) => {
    const { d, f } = formatDatetime(props.datetime);
    return {
      type: 'time',
      time: d.toISOString(),
      value: f,
    };
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  const { f } = formatDatetime(node.attrs.datetime);
  state.write(f);
};

export const toTex: TexFormatSerialize = (state, node) => {
  const { f } = formatDatetime(node.attrs.datetime);
  state.write(f);
};

export default time;
