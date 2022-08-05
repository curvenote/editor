import type { MarkdownSerializerState } from 'prosemirror-markdown';
import type { Node, AttributeSpec } from 'prosemirror-model';
import type { NodeDef, Attr, MyNodeSpec } from '../types';

export const DEFAULT_FORMAT = '.1f';

export const createAttr = (
  name: string,
  func: boolean | 'only' = true,
  defaultValue: string | false = '',
): Attr => {
  if (defaultValue === false) {
    return {
      name,
      func,
      default: false,
      optional: false,
    };
  }
  return {
    name,
    func,
    default: defaultValue,
    optional: true,
  };
};

type O = Record<string, string>;

export function createSpec<N extends O & { type: string }>(
  def: NodeDef,
  domAttrs?: (props: O) => O,
): MyNodeSpec<O, N> {
  const attrs: Record<string, AttributeSpec> = {};
  def.attrs.forEach((attr) => {
    if (attr.func !== 'only') {
      attrs[attr.name] = !attr.optional ? {} : { default: attr.default ?? '' };
    }
    if (attr.func) {
      attrs[`${attr.name}Function`] = { default: '' };
    }
  });
  const spec: MyNodeSpec<O, N> = {
    inline: def.inline,
    group: def.group,
    attrs,
    toDOM(node) {
      const props: O = {};
      def.attrs.forEach((attr) => {
        const [value, valueFunction] = [node.attrs[attr.name], node.attrs[`${attr.name}Function`]];
        if (value && attr.func !== 'only') props[attr.name] = value;
        if (attr.func && valueFunction) props[`:${attr.name}`] = valueFunction;
      });
      return [def.tag, domAttrs ? domAttrs(props) : props];
    },
    parseDOM: [
      {
        tag: def.tag,
        getAttrs(dom: any) {
          const props: Record<string, string> = {};
          def.attrs.forEach((attr) => {
            if (attr.func !== 'only')
              props[attr.name] = dom.getAttribute(attr.name) ?? attr.default;
            if (attr.func) props[`${attr.name}Function`] = dom.getAttribute(`:${attr.name}`) ?? '';
          });
          return props;
        },
      },
    ],
    attrsFromMyst(token) {
      const props: O = {};
      def.attrs.forEach((attr) => {
        const [value, valueFunction] = [token[attr.name], token[`${attr.name}Function`]];
        if (value && attr.func !== 'only') props[attr.name] = value;
        if (attr.func && valueFunction) props[`${attr.name}Function`] = valueFunction;
      });
      return props;
    },
    toMyst(props) {
      const node: any = {
        type: def.mystType,
      };
      def.attrs.forEach((attr) => {
        const [value, valueFunction] = [props[attr.name], props[`:${attr.name}`]];
        if (value && attr.func !== 'only') node[attr.name] = value;
        if (attr.func && valueFunction) node[`${attr.name}Function`] = valueFunction;
      });
      return node;
    },
  };
  return spec;
}

function encodeFunctionName(state: MarkdownSerializerState, name: string, value: string) {
  const [first, ...rest] = name;
  const encoded = `r${first.toUpperCase()}${rest.join('')}`;
  return `${encoded}=${(state as any).quote(value)}`;
}

export const nodeToMystRole = (state: MarkdownSerializerState, node: Node, def: NodeDef) => {
  state.write(`{${def.name}}\``);
  const values = def.attrs.map((attr) => {
    if (attr.func) {
      const value = node.attrs[attr.name];
      const valueFunction = node.attrs[`${attr.name}Function`];
      const prop = `${attr.name}=${(state as any).quote(value ?? '')}`;
      const propFunction = encodeFunctionName(state, attr.name, valueFunction);
      if (valueFunction || attr.func === 'only') {
        if (attr.func === 'only' && valueFunction === attr.default) return null;
        return propFunction;
      }
      return value === attr.default ? null : prop;
    }
    const value = node.attrs[attr.name];
    return value === attr.default ? null : `${attr.name}=${(state as any).quote(value)}`;
  });
  state.write(values.filter((v) => !!v).join(', '));
  state.write('`');
};

export const nodeToMystDirective = (state: MarkdownSerializerState, node: Node, def: NodeDef) => {
  state.ensureNewLine();
  state.write(`\`\`\`{${def.name}}`);
  state.ensureNewLine();
  const values = def.attrs.map((attr) => {
    if (attr.func) {
      const value = node.attrs[attr.name];
      const valueFunction = node.attrs[`${attr.name}Function`];
      const prop = `:${attr.name}: ${(state as any).quote(value ?? '')}`;
      const propFunction = `:${attr.name}Function: ${(state as any).quote(valueFunction)}`;
      if (valueFunction || attr.func === 'only') return propFunction;
      return prop;
    }
    const value = node.attrs[attr.name];
    return value ? `:${attr.name}: ${(state as any).quote(value)}` : null;
  });
  state.write(values.filter((v) => v !== null).join('\n'));
  state.write('\n```');
  state.closeBlock(node);
};
